
    // Inline JSON Data
    const videos = [
      { title: "Career Planning Tips", url: "https://www.youtube.com/embed/2OEL4P1Rz04" },
      { title: "Future Skills Podcast", url: "https://www.youtube.com/embed/aqz-KE-bpKQ" },
      { title: "Success in Tech Careers", url: "https://www.youtube.com/embed/LXb3EKWsInQ" }
    ];
    const stories = [
      { name: "Ali - Student", img: "b1.jpg", text: "Ali explored multiple fields before finding his passion in data science.", category: "student" },
      { name: "Sara - Graduate", img: "g1.jpg", text: "Sara landed her first job by using career checklists and interview guides.", category: "graduate" },
      { name: "Ahmed - Professional", img: "bp.jpg", text: "Ahmed successfully transitioned into IT from a non-tech background.", category: "professional" },
      { name: "Fatima - Graduate", img: "g2.jpg", text: "Fatima pursued an MBA after guidance, achieving her dream career.", category: "graduate" }
    ];
    const resources = {
      "Articles": [
        { title: "How to Choose Your Career Path", url: "#" },
        { title: "Future of Work Trends", url: "#" }
      ],
      "eBooks": [
        { title: "Career Guide 2025 (PDF)", url: "#" },
        { title: "Self-Discovery Workbook", url: "#" }
      ],
      "Checklists": [
        { title: "Resume Checklist", url: "#" },
        { title: "Interview Prep Guide", url: "#" }
      ]
    };

    // Render Videos
    const videoGrid = document.getElementById("videoGrid");
    videos.forEach(v => {
      const div = document.createElement("div");
      div.classList.add("video-card");
      div.innerHTML = `<iframe src="${v.url}" frameborder="0" allowfullscreen></iframe><h4>${v.title}</h4>`;
      videoGrid.appendChild(div);
    });

    // Render Success Stories
    const storyGrid = document.getElementById("storyGrid");
    function renderStories(filter) {
      storyGrid.innerHTML = "";
      stories.filter(s => filter === "all" || s.category === filter).forEach(s => {
        const card = document.createElement("div");
        card.classList.add("story-card");
        card.innerHTML = `
          <img src="${s.img}" alt="${s.name}">
          <h4>${s.name}</h4>
          <p>${s.text}</p>
          <button class="bookmark-btn" onclick="addBookmark('${s.name}')">Bookmark</button>
        `;
        storyGrid.appendChild(card);
      });
    }
    renderStories("all");
    function filterStories(type) { renderStories(type); }

    // Render Resources
    const library = document.getElementById("resourceLibrary");
    function renderResources(search = "") {
      library.innerHTML = "";
      Object.keys(resources).forEach(category => {
        const items = resources[category].filter(r => r.title.toLowerCase().includes(search.toLowerCase()));
        if (items.length > 0) {
          const div = document.createElement("div");
          div.classList.add("resource-category");
          div.innerHTML = `<h3 onclick="toggleResources(this)">${category}</h3>
            <div class="resource-links">${items.map(r => `<a href="${r.url}" target="_blank">${r.title}</a>`).join("")}</div>`;
          library.appendChild(div);
        }
      });
    }
    renderResources();

    function toggleResources(el) {
      const links = el.nextElementSibling;
      links.style.display = links.style.display === "block" ? "none" : "block";
    }
    document.getElementById("searchInput").addEventListener("input", e => {
      renderResources(e.target.value);
    });

    // Bookmarks System
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const bookmarkList = document.getElementById("bookmarkList");
    const bookmarkCount = document.getElementById("bookmarkCount");

    function renderBookmarks() {
      bookmarkList.innerHTML = "";
      bookmarks.forEach((b, i) => {
        const li = document.createElement("li");
        li.innerHTML = `${b} <button onclick="removeBookmark(${i})">Remove</button>`;
        bookmarkList.appendChild(li);
      });
      bookmarkCount.textContent = bookmarks.length;
    }
    function addBookmark(item) {
      if (!bookmarks.includes(item)) {
        bookmarks.push(item);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        renderBookmarks();
      }
    }
    function removeBookmark(index) {
      bookmarks.splice(index, 1);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      renderBookmarks();
    }
    function exportBookmarks() {
      const blob = new Blob([bookmarks.join("\n")], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "bookmarks.txt";
      link.click();
    }
    renderBookmarks();
