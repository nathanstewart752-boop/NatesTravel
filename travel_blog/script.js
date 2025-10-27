/*
 * travel_blog/script.js
 *
 * This script drives the homepage of the simple travel blog. It
 * highlights the most recent trip and builds a static world map with
 * markers for each trip. When a user clicks on a marker, they are
 * navigated to the corresponding post.
 */

// Metadata describing each trip. Feel free to append new objects to
// this array when you add more posts. Keep the date in YYYY‑MM‑DD
// format so the script can determine the latest entry.
const POSTS_DATA = [
  {
    slug: 'paris.html',
    title: 'Trip to Paris',
    date: '2025-04-15',
    lat: 48.8584,
    lon: 2.2945,
    excerpt: 'An unforgettable visit to the City of Light. I wandered the streets, enjoyed delicious French pastries, and soaked in the ambiance along the Seine.'
  },
  {
    slug: 'tokyo.html',
    title: 'Exploring Tokyo',
    date: '2024-10-01',
    lat: 35.6895,
    lon: 139.6917,
    excerpt: 'Neon lights, bustling streets, and the perfect mix of tradition and modernity. Tokyo offered endless surprises from sunrise to late into the night.'
  },
  {
    slug: 'niagara.html',
    title: 'Niagara Falls Adventure',
    date: '2023-06-10',
    lat: 43.0962,
    lon: -79.0377,
    excerpt: 'A roaring natural wonder right on our doorstep. Getting up close to the cascading water and feeling the spray was a truly exhilarating experience.'
  }
];

// When the page is ready, populate the latest post section and build the map
document.addEventListener('DOMContentLoaded', () => {
  if (!Array.isArray(POSTS_DATA) || POSTS_DATA.length === 0) return;
  // Determine the most recent trip by date
  const sorted = POSTS_DATA.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  const latest = sorted[0];
  // Populate the latest post section
  const latestSection = document.getElementById('latest-post');
  if (latestSection) {
    const parts = [];
    parts.push(`<h2>${latest.title}</h2>`);
    parts.push(`<p class="date">${formatDate(latest.date)}</p>`);
    const imageName = latest.slug.replace(/\.html$/, '');
    parts.push(`<img src="images/${imageName}.png" alt="${latest.title}">`);
    parts.push(`<p>${latest.excerpt}</p>`);
    parts.push(`<p><a href="posts/${latest.slug}">Read full post</a></p>`);
    latestSection.innerHTML = parts.join('\n');
  }

  // Build map markers once the world map image has loaded. If the
  // image has already loaded by the time this script runs, build
  // markers immediately; otherwise, wait for the load event.
  const mapWrapper = document.getElementById('map-wrapper');
  const mapImg = mapWrapper ? mapWrapper.querySelector('img') : null;
  if (mapImg) {
    const buildMarkers = () => {
      const naturalWidth = mapImg.naturalWidth;
      const naturalHeight = mapImg.naturalHeight;
      POSTS_DATA.forEach(post => {
        const lat = parseFloat(post.lat);
        const lon = parseFloat(post.lon);
        // Convert lat/lon to x/y on the natural image using equirectangular projection
        const x = (lon + 180) / 360 * naturalWidth;
        const y = (90 - lat) / 180 * naturalHeight;
        // Convert to percentages based on natural dimensions
        const xPct = x * 100 / naturalWidth;
        const yPct = y * 100 / naturalHeight;
        const marker = document.createElement('div');
        marker.className = 'marker';
        marker.style.left = `${xPct}%`;
        marker.style.top = `${yPct}%`;
        marker.title = post.title;
        marker.addEventListener('click', () => {
          window.location.href = `posts/${post.slug}`;
        });
        mapWrapper.appendChild(marker);
      });
    };
    if (mapImg.complete) {
      // Image already loaded
      buildMarkers();
    } else {
      // Wait for the image to load before placing markers
      mapImg.addEventListener('load', buildMarkers);
    }
  }
});

/**
 * Format an ISO date string (YYYY‑MM‑DD) into a human‑readable form.
 * The function avoids timezone shifts by parsing the string manually.
 *
 * @param {string} isoDate ISO date string
 * @returns {string} Formatted date, e.g. "April 15, 2025"
 */
function formatDate(isoDate) {
  const parts = isoDate.split('-');
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[monthIndex] || '';
  return `${monthName}\u00a0${day},\u00a0${year}`;
}