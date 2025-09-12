


// <!-- ================= RESOURCES ================= -->

const resourcesConfig = {
  "students": "resources/students.json",
  "undergraduate": "resources/undergraduate.json",
  "graduate": "resources/graduate.json",
  "professional": "resources/professional.json"
};

function loadResources(userType) {
  const path = resourcesConfig[userType];
  if (!path) {
    console.error("No resources path found for type:", userType);
    return;
  }

  fetch(path)
    .then(res => res.json())
    .then(data => {
      displayResources(data);
    })
    .catch(err => console.error("Error loading resources:", err));
}

function displayResources(resources) {
  const resourcesList = document.getElementById("resourcesList");
  resourcesList.innerHTML = "";

  if (!resources || resources.length === 0) {
    resourcesList.innerHTML = `<p class="text-muted">No resources found for this category.</p>`;
    return;
  }

  const row = document.createElement("div");
  row.className = "row g-3"; // responsive row with gap

  resources.forEach(resource => {
    const card = document.createElement("div");
    card.className = "col-12 col-md-6"; // full width on small, 2 cols on medium+

    const imgSrc = resource.img || "images/resources/default.jpg";
    const title = resource.title || "Untitled Resource";
    const type = resource.type || "General";
    const desc = resource.description || "No description available.";
    const shortDesc = desc.length > 80 ? desc.substring(0, 80) + "..." : desc;
    const link = resource.link || "#";

    card.innerHTML = `
      <div class="card card-body resource-card h-100 shadow-sm">
        <div class="d-flex gap-3 flex-wrap">
          <img src="${imgSrc}" alt="${title}" class="img-fluid rounded" style="max-width:120px; object-fit:cover;">
          <div class="flex-grow-1">
            <h6 class="mb-1">${title}</h6>
            <div class="text-muted small">${type}</div>
            <p class="text-muted small mb-2">${shortDesc}</p>
            <div class="d-flex flex-wrap gap-2">
              <a href="${link}" target="_blank" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-box-arrow-up-right"></i> Open
              </a>
              <button class="btn btn-sm btn-primary read-resource"
                data-title="${title}"
                data-type="${type}"
                data-img="${imgSrc}"
                data-description="${desc}"
                data-link="${link}">
                <i class="bi bi-book"></i> Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    row.appendChild(card);
  });

  resourcesList.appendChild(row);

  // Attach Read More events
  document.querySelectorAll(".read-resource").forEach(btn => {
    btn.addEventListener("click", e => {
      const r = e.currentTarget.dataset;
      openResourceModal(r);
    });
  });
}

function openResourceModal(resource) {
  const modalTitle = document.getElementById("resourceModalLabel");
  const modalBody = document.getElementById("resourceModalBody");

  const title = resource.title || "Untitled";
  const type = resource.type || "Resource";
  const img = resource.img || "images/resources/default.jpg";
  const description = resource.description || "No description available.";
  const link = resource.link || "#";

  modalTitle.textContent = `${title} - ${type}`;
  modalBody.innerHTML = `
    <img src="${img}" alt="${title}" class="img-fluid rounded mb-3" style="max-height:200px; object-fit:cover;">
    <p>${description}</p>
    <a href="${link}" target="_blank" class="btn btn-primary">Open Resource</a>
  `;

  const resourceModal = new bootstrap.Modal(document.getElementById("resourceModal"));
  resourceModal.show();
}

// <!-- ================= RESOURCES ENDS ================= -->
