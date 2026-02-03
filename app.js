const RecipeApp = (() => {

    /* ---------------- DATA ---------------- */
    const recipes = [
        {
            id: 1,
            title: "Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "Classic creamy Italian pasta.",
            category: "pasta",
            ingredients: ["Pasta", "Eggs", "Cheese", "Pepper"],
            steps: [
                "Boil pasta",
                {
                    text: "Prepare sauce",
                    substeps: ["Beat eggs", "Add cheese", "Mix well"]
                },
                "Combine and serve"
            ]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Spiced creamy curry.",
            category: "curry",
            ingredients: ["Chicken", "Tomato", "Cream", "Spices"],
            steps: [
                "Marinate chicken",
                {
                    text: "Cook sauce",
                    substeps: [
                        "Heat oil",
                        "Add spices",
                        {
                            text: "Simmer",
                            substeps: ["Add tomato", "Add cream"]
                        }
                    ]
                },
                "Combine chicken and sauce"
            ]
        }
    ];

    /* ---------------- STATE ---------------- */
    let currentFilter = "all";
    let currentSort = "none";

    /* ---------------- DOM ---------------- */
    const container = document.querySelector("#recipe-container");
    const filterButtons = document.querySelectorAll("[data-filter]");
    const sortButtons = document.querySelectorAll("[data-sort]");

    /* ---------------- RECURSION ---------------- */
    const renderSteps = (steps, level = 0) => {
        return `<ul>
            ${steps.map(step => {
                if (typeof step === "string") {
                    return `<li class="substep">${step}</li>`;
                }
                return `
                    <li class="substep">${step.text}
                        ${renderSteps(step.substeps, level + 1)}
                    </li>
                `;
            }).join("")}
        </ul>`;
    };

    /* ---------------- UI ---------------- */
    const createCard = (r) => `
        <div class="recipe-card" data-id="${r.id}">
            <h3>${r.title}</h3>
            <div class="recipe-meta">
                <span>⏱ ${r.time} min</span>
                <span class="difficulty ${r.difficulty}">${r.difficulty}</span>
            </div>
            <p>${r.description}</p>

            <button class="toggle-btn" data-toggle="ingredients">Show Ingredients</button>
            <div class="ingredients-container">
                <ul>${r.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
            </div>

            <button class="toggle-btn" data-toggle="steps">Show Steps</button>
            <div class="steps-container steps">
                ${renderSteps(r.steps)}
            </div>
        </div>
    `;

    const renderRecipes = (list) => {
        container.innerHTML = list.map(createCard).join("");
    };

    /* ---------------- FILTER / SORT ---------------- */
    const applyFilter = (list) => {
        if (currentFilter === "quick") return list.filter(r => r.time < 30);
        if (currentFilter === "all") return list;
        return list.filter(r => r.difficulty === currentFilter);
    };

    const applySort = (list) => {
        if (currentSort === "name") return [...list].sort((a,b)=>a.title.localeCompare(b.title));
        if (currentSort === "time") return [...list].sort((a,b)=>a.time-b.time);
        return list;
    };

    const updateDisplay = () => {
        let result = applyFilter(recipes);
        result = applySort(result);
        renderRecipes(result);
    };

    /* ---------------- EVENTS ---------------- */
    const updateActive = (buttons, value, key) => {
        buttons.forEach(btn => {
            btn.classList.toggle("active", btn.dataset[key] === value);
        });
    };

    const setupEvents = () => {
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                currentFilter = btn.dataset.filter;
                updateActive(filterButtons, currentFilter, "filter");
                updateDisplay();
            });
        });

        sortButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                currentSort = btn.dataset.sort;
                updateActive(sortButtons, currentSort, "sort");
                updateDisplay();
            });
        });

        container.addEventListener("click", (e) => {
            if (!e.target.classList.contains("toggle-btn")) return;

            const card = e.target.closest(".recipe-card");
            const type = e.target.dataset.toggle;
            const section = card.querySelector(`.${type}-container`);

            section.classList.toggle("visible");
            e.target.textContent =
                section.classList.contains("visible")
                ? `Hide ${type}`
                : `Show ${type}`;
        });
    };

    /* ---------------- INIT ---------------- */
    const init = () => {
        console.log("RecipeApp initializing...");
        renderRecipes(recipes);
        setupEvents();
    };

    return { init };
})();

RecipeApp.init();
