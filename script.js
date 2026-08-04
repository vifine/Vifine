// ============================================
// Загрузка данных проектов из JSON "базы данных"
// ============================================

async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        if (!response.ok) throw new Error('Failed to load projects');
        return await response.json();
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}

// ============================================
// Рендер грида проектов на portfolio.html
// ============================================

function renderPortfolioGrid(projects) {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    const limit = grid.getAttribute('data-limit');
    const displayProjects = limit ? projects.slice(0, parseInt(limit, 10)) : projects;

    // Определяем формат: project-row (на projects.html) или portfolio-card (на index.html)
    const isProjectsList = grid.classList.contains('projects-list');

    if (isProjectsList) {
        // Формат project-row для projects.html
        grid.innerHTML = displayProjects.map(project => {
            const href = project.directLink ? project.directLink : `project.html?id=${project.id}`;
            const toolsHtml = project.tools && project.tools.length
                ? `<div class="project-row-tools">${project.tools.map(tool => `<span class="tech-tag">${tool}</span>`).join('')}</div>`
                : '';
            return `
            <a href="${href}" class="project-row">
                <div class="project-row-left">
                    <div class="project-location">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12.833S11.083 9.148 11.083 5.833A4.083 4.083 0 0 0 7 1.75a4.083 4.083 0 0 0-4.083 4.083c0 3.315 4.083 7 4.083 7Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="5.833" r="1.417" stroke="currentColor" stroke-width="1.2"/></svg>
                        <span>${project.companyLocation}</span>
                    </div>
                    <h3>${project.title}</h3>
                    <p class="project-desc">${project.tagline}</p>
                    ${toolsHtml}
                </div>
                <div class="project-row-right">
                    <span class="project-row-right-inner">
                        View project
                        <span class="row-arrow-wrap">
                            <img src="assets/img/icons/row-arrow-default.svg?v=2" alt="" class="row-arrow row-arrow-default">
                            <img src="assets/img/icons/row-arrow-hover.svg?v=2" alt="" class="row-arrow row-arrow-hover">
                        </span>
                    </span>
                </div>
            </a>
        `}).join('');
    } else {
        // Формат portfolio-card для index.html
        grid.innerHTML = displayProjects.map(project => {
            const href = project.directLink ? project.directLink : `project.html?id=${project.id}`;
            return `
            <a href="${href}" class="portfolio-card">
                <div class="portfolio-card-meta">
                    <span>${project.company}</span>
                    <span>${project.period}</span>
                </div>
                <h3>${project.title}</h3>
                <p class="portfolio-card-tagline">${project.tagline}</p>
                <div class="portfolio-card-tools">
                    ${project.tools.slice(0, 3).map(tool => `<span class="tech-tag">${tool}</span>`).join('')}
                </div>
                <span class="portfolio-card-link">View Case Study →</span>
            </a>
        `}).join('');
    }
}

// ============================================
// Рендер отдельной страницы проекта (project.html?id=xxx)
// ============================================

function renderProjectDetail(projects) {
    const container = document.getElementById('project-detail');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    const project = projects.find(p => p.id === projectId);

    if (!project) {
        container.innerHTML = `
            <div class="project-not-found">
                <h2>Project not found</h2>
                <p>Sorry, we couldn't find that project.</p>
                <a href="projects.html" class="btn btn-primary">Back to Projects</a>
            </div>
        `;
        return;
    }

    document.title = `${project.title} — Victoria Fine`;

    const imagesHtml = project.images && project.images.length > 0
        ? `<div class="project-images">
            ${project.images.map(img => `<img src="${img}" alt="${project.title}" class="project-image" onerror="this.style.display='none'">`).join('')}
           </div>`
        : '';

    const externalCaseHtml = project.externalCase
        ? `<a href="${project.externalCase}" target="_blank" class="btn btn-secondary">View Full Case Study →</a>`
        : '';

    container.innerHTML = `
        <a href="projects.html" class="back-link">← Back to Projects</a>

        <div class="project-detail-header">
            <div class="project-meta">
                <div class="project-meta-item"><span class="project-meta-label">Company:</span> ${project.company}, ${project.companyLocation}</div>
                <div class="project-meta-item"><span class="project-meta-label">Role:</span> ${project.role}</div>
                <div class="project-meta-item"><span class="project-meta-label">Period:</span> ${project.period}</div>
            </div>
            <h1>${project.title}</h1>
            <p class="project-detail-tagline">${project.tagline}</p>
        </div>

        ${imagesHtml}

        <div class="project-detail-body">
            <div class="project-detail-section">
                <h2>Summary</h2>
                <p>${project.summary}</p>
            </div>

            <div class="project-detail-section">
                <h2>The Challenge</h2>
                <p>${project.challenge}</p>
            </div>

            <div class="project-detail-section">
                <h2>The Solution</h2>
                <p>${project.solution}</p>
            </div>

            <div class="project-detail-section">
                <h2>Results</h2>
                <ul class="achievements">
                    ${project.results.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>

            <div class="project-detail-section">
                <h2>Tools & Technologies</h2>
                <div class="tech-tags">
                    ${project.tools.map(tool => `<span class="tech-tag">${tool}</span>`).join('')}
                </div>
            </div>

            ${externalCaseHtml ? `<div class="project-detail-section">${externalCaseHtml}</div>` : ''}
        </div>

        <div class="project-detail-cta">
            <a href="https://wa.me/972538791843?text=Hi%20Victoria%2C%20I%20saw%20your%20${encodeURIComponent(project.company)}%20project%20and%20want%20to%20discuss%20a%20similar%20challenge" class="btn btn-primary">Discuss a Similar Project</a>
        </div>
    `;
}

// ============================================
// Рендер связанного проекта на resume.html
// (используется через data-project-id атрибут)
// ============================================

function renderResumeProjectLinks(projects) {
    const links = document.querySelectorAll('[data-project-id]');
    links.forEach(link => {
        const projectId = link.getAttribute('data-project-id');
        const project = projects.find(p => p.id === projectId);
        if (project) {
            link.href = `project.html?id=${project.id}`;
            link.style.display = 'inline-block';
        } else {
            link.style.display = 'none';
        }
    });
}

// ============================================
// Поиск по списку проектов (live filter)
// ============================================
function initProjectsSearch() {
    const input = document.getElementById('projectsSearch');
    const grid = document.getElementById('portfolio-grid');
    const noResults = document.getElementById('projectsNoResults');
    if (!input || !grid) return;

    input.addEventListener('input', () => {
        filterProjects();
    });
}

// ============================================
// Инициализация фильтра по инструментам
// ============================================
function initToolsFilter(projects) {
    const toggle = document.getElementById('filterToggle');
    const dropdown = document.getElementById('filterDropdown');
    const toolOptions = document.getElementById('toolOptions');
    const resetBtn = document.getElementById('filterReset');
    if (!toggle || !dropdown || !toolOptions) return;

    // Собираем все уникальные инструменты
    const allTools = new Set();
    projects.forEach(p => {
        if (p.tools && Array.isArray(p.tools)) {
            p.tools.forEach(tool => allTools.add(tool));
        }
    });

    const sortedTools = Array.from(allTools).sort();

    // Создаём опции для каждого инструмента
    sortedTools.forEach(tool => {
        const div = document.createElement('div');
        div.className = 'filter-option';
        const id = `filter-${tool.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        div.innerHTML = `
            <input type="checkbox" id="${id}" class="filter-checkbox" data-tool="${tool}">
            <label for="${id}" class="filter-label">${tool}</label>
        `;
        toolOptions.appendChild(div);
    });

    // Обработка клика на toggle
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !dropdown.classList.contains('is-open');
        dropdown.classList.toggle('is-open', isOpen);
        dropdown.setAttribute('aria-hidden', !isOpen);
    });

    // Обработка чекбоксов
    const filterAll = document.getElementById('filterAll');
    const filterCheckboxes = dropdown.querySelectorAll('.filter-checkbox');

    filterAll.addEventListener('change', () => {
        if (filterAll.checked) {
            filterCheckboxes.forEach(cb => {
                if (cb.id !== 'filterAll') cb.checked = false;
            });
        }
        filterProjects();
    });

    filterCheckboxes.forEach(checkbox => {
        if (checkbox.id !== 'filterAll') {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    filterAll.checked = false;
                }
                filterProjects();
            });
        }
    });

    // Обработка кнопки сброса
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filterAll.checked = true;
            filterCheckboxes.forEach(cb => {
                if (cb.id !== 'filterAll') cb.checked = false;
            });
            filterProjects();
        });
    }

    // Закрытие dropdown при клике вне
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('is-open');
            dropdown.setAttribute('aria-hidden', 'true');
        }
    });
}

// ============================================
// Фильтрация проектов по поиску и инструментам
// ============================================
function filterProjects() {
    const grid = document.getElementById('portfolio-grid');
    const noResults = document.getElementById('projectsNoResults');
    const searchInput = document.getElementById('projectsSearch');
    const filterLabel = document.getElementById('filterLabel');
    const resetBtn = document.getElementById('filterReset');
    if (!grid) return;

    const searchQuery = (searchInput?.value || '').trim().toLowerCase();
    
    // Получаем выбранные инструменты
    const selectedTools = new Set();
    const checkboxes = document.querySelectorAll('#filterDropdown .filter-checkbox:not(#filterAll)');
    checkboxes.forEach(cb => {
        if (cb.checked) selectedTools.add(cb.getAttribute('data-tool'));
    });

    const filterAll = document.getElementById('filterAll');
    const isFilterAll = filterAll && filterAll.checked;

    // Обновляем label фильтра и показываем/скрываем кнопку сброса
    if (filterLabel) {
        if (isFilterAll || selectedTools.size === 0) {
            filterLabel.textContent = 'All tools';
            if (resetBtn) resetBtn.style.display = 'none';
        } else if (selectedTools.size === 1) {
            filterLabel.textContent = Array.from(selectedTools)[0];
            if (resetBtn) resetBtn.style.display = 'block';
        } else {
            filterLabel.textContent = `${selectedTools.size} tools`;
            if (resetBtn) resetBtn.style.display = 'block';
        }
    }

    const rows = grid.querySelectorAll('.project-row');
    let visibleCount = 0;

    rows.forEach(row => {
        // Проверяем поиск
        const text = row.textContent.toLowerCase();
        const matchesSearch = searchQuery === '' || text.includes(searchQuery);

        // Проверяем фильтр инструментов
        let matchesFilter = isFilterAll || selectedTools.size === 0;
        if (!isFilterAll && selectedTools.size > 0) {
            // Скрываем проекты которые не содержат выбранный инструмент
            const toolsText = row.querySelector('.project-row-tools')?.textContent || '';
            matchesFilter = Array.from(selectedTools).some(tool => 
                toolsText.includes(tool)
            );
        }

        const shouldDisplay = matchesSearch && matchesFilter;
        row.style.display = shouldDisplay ? '' : 'none';
        if (shouldDisplay) visibleCount++;

        // Подсвечиваем/обесцвечиваем пилюли (tech tags)
        const toolsTags = row.querySelectorAll('.tech-tag');
        if (isFilterAll || selectedTools.size === 0) {
            // Все пилюли нормальные - убираем стили выделения
            toolsTags.forEach(tag => {
                tag.classList.remove('tag-highlighted');
            });
        } else {
            // Выбраны конкретные инструменты - подсвечиваем только их
            toolsTags.forEach(tag => {
                const tagText = tag.textContent.trim();
                const isSelected = Array.from(selectedTools).some(tool => tool === tagText);
                tag.classList.toggle('tag-highlighted', isSelected);
            });
        }
    });

    if (noResults) {
        noResults.classList.toggle('is-visible', visibleCount === 0);
    }
}

// ============================================
// Инициализация при загрузке страницы
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    const projects = await loadProjects();

    renderPortfolioGrid(projects);
    renderProjectDetail(projects);
    renderResumeProjectLinks(projects);
    initToolsFilter(projects);
    initProjectsSearch();
});
