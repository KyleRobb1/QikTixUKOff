'use client';

import { useState } from 'react';
import { Place } from '@/types/place';
import { createClient } from '@/utils/supabase/server';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';

interface Trip {
  id: string;
  name: string;
  places: Place[];
  notes: string;
}

export default function TripPlanner() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .ilike('name', `%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching places:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlace = (place: Place) => {
    setSelectedPlaces((prev) => [...prev, place]);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleRemovePlace = (index: number) => {
    setSelectedPlaces((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(selectedPlaces);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedPlaces(items);
  };

  const handleSaveTrip = async () => {
    if (selectedPlaces.length === 0) return;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('trips')
        .insert([
          {
            name: 'New Trip',
            places: selectedPlaces.map((place) => place.id),
            notes: '',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setTrips((prev) => [...prev, data as Trip]);
      setSelectedPlaces([]);
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Trip Planner</h1>

      {/* Search Section */}
      <div className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for places to add..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {searchResults.map((place) => (
              <div
                key={place.id}
                className="flex justify-between items-center p-3 bg-white rounded-lg shadow"
              >
                <div>
                  <h3 className="font-medium">{place.name}</h3>
                  <p className="text-sm text-gray-600">{place.category}</p>
                </div>
                <button
                  onClick={() => handleAddPlace(place)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Places */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Itinerary</h2>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="places">
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {selectedPlaces.map((place, index) => (
                  <Draggable
                    key={place.id}
                    draggableId={place.id}
                    index={index}
                  >
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex justify-between items-center p-3 bg-white rounded-lg shadow"
                      >
                        <div>
                          <h3 className="font-medium">{place.name}</h3>
                          <p className="text-sm text-gray-600">
                            {place.category}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemovePlace(index)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {selectedPlaces.length > 0 && (
          <button
            onClick={handleSaveTrip}
            className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save Trip
          </button>
        )}
      </div>

      {/* Saved Trips */}
      {trips.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Saved Trips</h2>
          <div className="space-y-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="p-4 bg-white rounded-lg shadow"
              >
                <h3 className="font-medium">{trip.name}</h3>
                <p className="text-sm text-gray-600">
                  {trip.places.length} places
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 