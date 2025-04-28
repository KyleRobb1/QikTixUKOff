#!/bin/bash

# Create images directory if it doesn't exist
mkdir -p public/images

# Download placeholder images
curl -o public/images/hero-dumfries.jpg "https://source.unsplash.com/1600x900/?scotland,landscape"
curl -o public/images/places-hero.jpg "https://source.unsplash.com/1600x900/?castle,scotland"
curl -o public/images/not-found.jpg "https://source.unsplash.com/800x600/?map,compass"
curl -o public/images/caerlaverock.jpg "https://source.unsplash.com/800x600/?castle,medieval"
curl -o public/images/sweetheart-abbey.jpg "https://source.unsplash.com/800x600/?abbey,ruins"
curl -o public/images/threave-castle.jpg "https://source.unsplash.com/800x600/?castle,island"
curl -o public/images/galloway-forest.jpg "https://source.unsplash.com/800x600/?forest,scotland"
curl -o public/images/cream-galloway.jpg "https://source.unsplash.com/800x600/?farm,icecream"
curl -o public/images/logan-garden.jpg "https://source.unsplash.com/800x600/?garden,botanical"
curl -o public/images/places-card.jpg "https://source.unsplash.com/800x600/?castle,historic"
curl -o public/images/walks-card.jpg "https://source.unsplash.com/800x600/?hiking,scotland"
curl -o public/images/trips-card.jpg "https://source.unsplash.com/800x600/?travel,planning" 