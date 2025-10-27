// main.js
// This script fetches the list of travel posts, displays the most recent
// entry on the homepage, and builds an image-based world map with clickable
// markers.

document.addEventListener('DOMContentLoaded', function() {
  // Load posts metadata
  fetch('posts.json')
    .then(function(response) {
      if (!response.ok) throw new Error('Failed to load posts.json');
      return response.json();
    })
    .then(function(posts) {
      if (!Array.isArray(posts) || posts.length === 0) return;
      // Sort posts by date descending (newest first)
      posts.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });

      const latest = posts[0];
      // Fetch the HTML content of the latest post
      fetch('posts/' + latest.slug)
        .then(function(res) {
          if (!res.ok) throw new Error('Failed to load latest post');
          return res.text();
        })
        .then(function(html) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const article = doc.querySelector('article');
          const latestContainer = document.getElementById('latest-content');
          if (article && latestContainer) {
            // Insert the content of the article
            latestContainer.innerHTML = '';
            Array.from(article.childNodes).forEach(function(node) {
              latestContainer.appendChild(node.cloneNode(true));
            });
            // Add a read more link
            const readMore = document.createElement('p');
            const link = document.createElement('a');
            link.href = 'posts/' + latest.slug;
            link.textContent = 'Read full story →';
            readMore.appendChild(link);
            latestContainer.appendChild(readMore);
          }
        })
        .catch(function(err) {
          console.error(err);
        });

      // Build the map markers once the map image has loaded
      const mapImg = document.getElementById('world-map');
      mapImg.addEventListener('load', function() {
        const container = document.getElementById('map-container');
        const width = mapImg.naturalWidth;
        const height = mapImg.naturalHeight;
        posts.forEach(function(post) {
          const lat = parseFloat(post.lat);
          const lon = parseFloat(post.lon);
          // Convert lat/lon to x/y using an equirectangular projection
          const x = (lon + 180) / 360 * width;
          const y = (90 - lat) / 180 * height;
          const marker = document.createElement('a');
          marker.href = 'posts/' + post.slug;
          marker.className = 'marker';
          // Use percentages so markers scale with the image
          marker.style.left = (x * 100 / width) + '%';
          marker.style.top = (y * 100 / height) + '%';
          marker.title = post.title;
          container.appendChild(marker);
        });
      });
    })
    .catch(function(err) {
      console.error(err);
    });
});
