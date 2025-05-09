// Ticket model and related functions

const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const supabase = require('../config/supabaseClient');
const { v4: uuidv4 } = require('uuid');

class Ticket {
  constructor(data) {
    this.ticket_id = data.ticket_id;
    this.user_id = data.user_id;
    this.event_id = data.event_id;
    this.ticket_type = data.ticket_type;
    this.purchase_price = data.purchase_price;
    this.purchase_date = data.created_at;
    this.qr_code = data.qr_code;
  }

  static async createTicket(userId, eventId, ticketType, price) {
    try {
      // Generate unique ticket reference
      const ticketRef = uuidv4();
      
      // Generate QR code data - this would typically contain a URL to verify the ticket
      const qrData = JSON.stringify({
        ticketRef,
        userId, 
        eventId,
        ticketType,
        timestamp: new Date().toISOString()
      });
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(qrData);
      
      // Insert ticket into database
      const { data, error } = await supabase
        .from('tickets')
        .insert([
          { 
            user_id: userId,
            event_id: eventId,
            ticket_type: ticketType,
            purchase_price: price,
            qr_code: qrCodeDataUrl
          }
        ])
        .select();
      
      if (error) {
        throw new Error(`Failed to create ticket: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        throw new Error('Ticket was created but no data was returned');
      }
      
      // Return new ticket instance
      return new Ticket(data[0]);
    } catch (err) {
      console.error('Error creating ticket:', err);
      throw err;
    }
  }

  static async getTicketsByUser(userId) {
    try {
      // Get tickets with event details
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          ticket_id,
          user_id,
          event_id,
          ticket_type,
          purchase_price,
          created_at,
          qr_code,
          events (
            event_id,
            name,
            date,
            location,
            description,
            price
          )
        `)
        .eq('user_id', userId);
      
      if (error) {
        throw new Error(`Failed to get tickets: ${error.message}`);
      }
      
      // Map data to Ticket instances
      return data.map(item => ({
        ...new Ticket(item),
        event: item.events
      }));
    } catch (err) {
      console.error('Error fetching tickets:', err);
      throw err;
    }
  }

  static async getTicketById(ticketId, userId) {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          ticket_id,
          user_id,
          event_id,
          ticket_type,
          purchase_price,
          created_at,
          qr_code,
          events (
            event_id,
            name,
            date,
            location,
            description,
            price
          )
        `)
        .eq('ticket_id', ticketId)
        .eq('user_id', userId)
        .single();
      
      if (error) {
        throw new Error(`Failed to get ticket: ${error.message}`);
      }
      
      if (!data) {
        return null;
      }
      
      return {
        ...new Ticket(data),
        event: data.events
      };
    } catch (err) {
      console.error('Error fetching ticket:', err);
      throw err;
    }
  }
  
  // Generate Apple Wallet pass
  async generateAppleWalletPass() {
    // This is a placeholder - in a real implementation you would use a library
    // like pass-js (https://github.com/tinovyatkin/pass-js) to generate
    // actual Apple Wallet passes
    
    // For now, we'll just return a success indicator
    return {
      success: true,
      message: "Apple Wallet pass would be generated here"
    };
  }
}

module.exports = Ticket;

// Function to generate a unique ticket ID
const generateTicketId = () => {
    // Generate a ticket ID with format TIX-XXXXX-XXXXX
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'TIX-';
    
    // First group of 5
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    result += '-';
    
    // Second group of 5
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
};

// Generate PDF ticket
exports.generateTicketPDF = async (ticket, event) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ticketId = ticket.ticket_id;
            
            // Create PDF document
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50
            });
            
            // Set up the PDF file path
            const pdfDirectory = path.join(__dirname, '../../public/tickets');
            
            // Ensure directory exists
            if (!fs.existsSync(pdfDirectory)) {
                fs.mkdirSync(pdfDirectory, { recursive: true });
            }
            
            const pdfPath = path.join(pdfDirectory, `${ticketId}.pdf`);
            const pdfStream = fs.createWriteStream(pdfPath);
            
            // Pipe PDF to file
            doc.pipe(pdfStream);
            
            // Generate QR code
            const qrDataUrl = await exports.generateTicketQR(ticketId);
            
            // Add content to PDF
            doc.fontSize(25).text('qiktix uk', { align: 'center' });
            doc.fontSize(20).text('Event Ticket', { align: 'center' });
            doc.moveDown();
            
            // Event details
            doc.fontSize(16).text(event.name, { align: 'center' });
            doc.fontSize(12).text(`Date: ${new Date(event.date).toLocaleString()}`, { align: 'center' });
            doc.fontSize(12).text(`Location: ${event.location}`, { align: 'center' });
            doc.moveDown();
            
            // Ticket details
            doc.fontSize(14).text(`Ticket Type: ${ticket.ticket_type}`, { align: 'center' });
            doc.fontSize(14).text(`Ticket ID: ${ticketId}`, { align: 'center' });
            doc.fontSize(12).text(`Purchased: ${new Date(ticket.purchase_date).toLocaleString()}`, { align: 'center' });
            doc.moveDown(2);
            
            // Add QR code (strip off the data:image/png;base64, part)
            const qrImage = qrDataUrl.split(',')[1];
            doc.image(Buffer.from(qrImage, 'base64'), {
                fit: [250, 250],
                align: 'center'
            });
            doc.moveDown();
            
            // Add footer
            doc.fontSize(10).text('Please present this ticket (digital or printed) at the entrance.', { align: 'center' });
            doc.fontSize(10).text('Valid for one-time entry only.', { align: 'center' });
            
            // Finalize PDF
            doc.end();
            
            pdfStream.on('finish', () => {
                resolve(`/tickets/${ticketId}.pdf`);
            });
            
            pdfStream.on('error', (err) => {
                reject(err);
            });
            
        } catch (err) {
            console.error('Error generating PDF ticket:', err);
            reject(err);
        }
    });
};

// Generate QR code for a ticket (as data URL)
exports.generateTicketQR = async (ticketId) => {
    try {
        // Create QR code with ticket ID and current timestamp to prevent copying
        const qrData = JSON.stringify({
            ticket: ticketId,
            timestamp: new Date().toISOString(),
            valid: true
        });
        
        // Generate QR code as data URL
        const qrDataUrl = await QRCode.toDataURL(qrData, {
            errorCorrectionLevel: 'H',
            width: 300,
            margin: 1
        });
        
        return qrDataUrl;
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw err;
    }
}; 