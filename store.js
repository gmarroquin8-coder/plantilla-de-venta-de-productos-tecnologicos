const categories = [
      {
        id: "electrodomesticos",
        name: "Electrodomésticos",
        emoji: "🏠",
        products: [
          { id: "cafetera", name: "Cafetera automática Aroma+", emoji: "☕", price: 1899, badge: "Más vendido", rating: "4.9", reviews: 128 },
          { id: "freidora", name: "Freidora de aire Crispy 5L", emoji: "🍟", price: 2299, badge: "Favorito", rating: "4.8", reviews: 94 },
          { id: "licuadora", name: "Licuadora ProBlend 900", emoji: "🥤", price: 1299, badge: "", rating: "4.7", reviews: 76 },
          { id: "aspiradora", name: "Aspiradora compacta CleanGo", emoji: "🧹", price: 2499, badge: "Nuevo", rating: "4.8", reviews: 41 }
        ]
      },
      {
        id: "computacion",
        name: "Computación",
        emoji: "💻",
        products: [
          { id: "laptop", name: "Laptop Nova 14″ · 16 GB RAM", emoji: "💻", price: 16999, badge: "Top", rating: "4.9", reviews: 203 },
          { id: "teclado", name: "Teclado mecánico RGB Nova", emoji: "⌨️", price: 1599, badge: "", rating: "4.8", reviews: 87 },
          { id: "mouse", name: "Mouse inalámbrico ergonómico", emoji: "🖱️", price: 699, badge: "Oferta", rating: "4.7", reviews: 156 },
          { id: "monitor", name: "Monitor UltraView 27″ QHD", emoji: "🖥️", price: 6499, badge: "Nuevo", rating: "4.9", reviews: 62 }
        ]
      },
      {
        id: "casa-smart",
        name: "Casa smart",
        emoji: "💡",
        products: [
          { id: "foco-smart", name: "Foco inteligente Wi-Fi · Pack de 2", emoji: "💡", price: 499, badge: "Ahorra energía", rating: "4.8", reviews: 111 },
          { id: "camara", name: "Cámara interior Smart View", emoji: "📷", price: 1099, badge: "", rating: "4.7", reviews: 78 },
          { id: "enchufe", name: "Enchufe inteligente con medidor", emoji: "🔌", price: 349, badge: "Oferta", rating: "4.8", reviews: 143 },
          { id: "asistente", name: "Asistente de voz Mini", emoji: "🗣️", price: 999, badge: "", rating: "4.6", reviews: 55 }
        ]
      },
      {
        id: "telefonos",
        name: "Teléfonos",
        emoji: "📱",
        products: [
          { id: "smartphone", name: "Smartphone Nova X · 256 GB", emoji: "📱", price: 12999, badge: "Nuevo", rating: "4.9", reviews: 167 },
          { id: "cargador", name: "Cargador rápido USB-C 30 W", emoji: "🔋", price: 549, badge: "", rating: "4.8", reviews: 210 },
          { id: "funda", name: "Funda protectora Crystal", emoji: "🛡️", price: 399, badge: "Oferta", rating: "4.6", reviews: 93 },
          { id: "powerbank", name: "Batería portátil 20,000 mAh", emoji: "🔋", price: 899, badge: "", rating: "4.8", reviews: 122 }
        ]
      },
      {
        id: "audifonos",
        name: "Audífonos",
        emoji: "🎧",
        products: [
          { id: "audifonos-pro", name: "Audífonos inalámbricos Wave Pro", emoji: "🎧", price: 2499, badge: "Más vendido", rating: "4.9", reviews: 184 },
          { id: "audifonos-sport", name: "Audífonos deportivos Flex", emoji: "🎵", price: 999, badge: "", rating: "4.7", reviews: 98 },
          { id: "audifonos-studio", name: "Audífonos Studio con cancelación", emoji: "🎧", price: 3899, badge: "Nuevo", rating: "4.8", reviews: 72 },
          { id: "audifonos-kids", name: "Audífonos Kids seguros", emoji: "🎶", price: 649, badge: "", rating: "4.8", reviews: 61 }
        ]
      },
      {
        id: "bocinas",
        name: "Bocinas",
        emoji: "🔊",
        products: [
          { id: "bocina-portatil", name: "Bocina portátil Pulse Mini", emoji: "🔊", price: 1299, badge: "Favorito", rating: "4.8", reviews: 136 },
          { id: "bocina-fiesta", name: "Bocina PartyBoom resistente al agua", emoji: "🎶", price: 2799, badge: "", rating: "4.7", reviews: 84 },
          { id: "bocina-smart", name: "Bocina inteligente HomePod", emoji: "📻", price: 1899, badge: "Nuevo", rating: "4.8", reviews: 67 },
          { id: "soundbar", name: "Barra de sonido Cinema 2.1", emoji: "📢", price: 3199, badge: "", rating: "4.9", reviews: 49 }
        ]
      },
      {
        id: "juguetes",
        name: "Juguetes",
        emoji: "🧸",
        products: [
          { id: "robot", name: "Robot programable RoboLab", emoji: "🤖", price: 1499, badge: "Aprende jugando", rating: "4.9", reviews: 57 },
          { id: "dron-kids", name: "Mini dron Explorer para principiantes", emoji: "🚁", price: 1199, badge: "", rating: "4.6", reviews: 44 },
          { id: "kit-ciencia", name: "Kit de ciencia y experimentos", emoji: "🧪", price: 799, badge: "Favorito", rating: "4.8", reviews: 73 },
          { id: "carro-rc", name: "Auto a control remoto Turbo", emoji: "🏎️", price: 899, badge: "", rating: "4.7", reviews: 68 }
        ]
      },
      {
        id: "videojuegos",
        name: "Videojuegos",
        emoji: "🕹️",
        products: [
          { id: "aventura", name: "Aventura Galáctica · Edición física", emoji: "🚀", price: 1199, badge: "Lanzamiento", rating: "4.9", reviews: 105 },
          { id: "deportes", name: "Liga Total 2025 · Juego deportivo", emoji: "⚽", price: 999, badge: "", rating: "4.7", reviews: 81 },
          { id: "racing", name: "Velocidad Extrema · Edición deluxe", emoji: "🏁", price: 1399, badge: "Oferta", rating: "4.8", reviews: 64 },
          { id: "indie", name: "Mundos Pixel · Colección indie", emoji: "👾", price: 749, badge: "", rating: "4.8", reviews: 92 }
        ]
      },
      {
        id: "consolas",
        name: "Consolas",
        emoji: "🎮",
        products: [
          { id: "consola-nova", name: "Consola Nova Play · 1 TB", emoji: "🎮", price: 11999, badge: "Top", rating: "4.9", reviews: 178 },
          { id: "consola-portatil", name: "Consola portátil PocketPlay", emoji: "🕹️", price: 6999, badge: "Nuevo", rating: "4.8", reviews: 97 },
          { id: "consola-retro", name: "Consola retro Arcade Mini", emoji: "👾", price: 1899, badge: "", rating: "4.6", reviews: 53 },
          { id: "consola-familiar", name: "Consola familiar Motion Fun", emoji: "🎯", price: 8499, badge: "", rating: "4.7", reviews: 61 }
        ]
      },
      {
        id: "controles",
        name: "Controles",
        emoji: "🕹️",
        products: [
          { id: "control-wireless", name: "Control inalámbrico Nova Pro", emoji: "🎮", price: 1499, badge: "Más vendido", rating: "4.9", reviews: 132 },
          { id: "control-pc", name: "Control universal para PC", emoji: "🕹️", price: 899, badge: "", rating: "4.7", reviews: 86 },
          { id: "control-retro", name: "Control arcade Retro Stick", emoji: "👾", price: 1299, badge: "Nuevo", rating: "4.8", reviews: 47 },
          { id: "control-kids", name: "Control compacto para juegos", emoji: "🎯", price: 699, badge: "", rating: "4.6", reviews: 39 }
        ]
      }
    ];

    const additionalProducts = {
      electrodomesticos: [
        ["microondas", "Microondas digital QuickHeat", "♨️", 2199],
        ["tostador", "Tostador compacto 2 rebanadas", "🍞", 599],
        ["arrocera", "Arrocera eléctrica EasyCook", "🍚", 899],
        ["hervidor", "Hervidor eléctrico de acero", "🫖", 749],
        ["sandwichera", "Sandwichera grill Duo", "🥪", 699],
        ["plancha", "Plancha de vapor SteamGo", "👔", 849],
        ["purificador", "Purificador de aire PureHome", "🌬️", 2899],
        ["batidora", "Batidora de mano MixPro", "🥣", 799],
        ["refrigerador", "Minirrefrigerador Fresh 90L", "🧊", 4299],
        ["procesador", "Procesador de alimentos MultiChef", "🥕", 1699],
        ["aspiradora-robot", "Aspiradora robot SmartClean", "🤖", 3599]
      ],
      computacion: [
        ["pc-escritorio", "PC de escritorio Nova Core", "🖥️", 14999],
        ["webcam", "Webcam Full HD con micrófono", "📹", 1199],
        ["ssd", "SSD externo portátil 1 TB", "💾", 1799],
        ["hub-usbc", "Hub USB-C de 7 puertos", "🔌", 899],
        ["router", "Router Wi-Fi 6 de doble banda", "📡", 1599],
        ["disco-externo", "Disco externo portátil 2 TB", "💽", 1899],
        ["base-laptop", "Base ajustable para laptop", "💻", 649],
        ["cooler-laptop", "Base enfriadora con ventiladores", "🌬️", 799],
        ["tableta-grafica", "Tableta gráfica SketchPad", "✍️", 2199],
        ["microfono-usb", "Micrófono USB para streaming", "🎙️", 1399],
        ["memoria-usb", "Memoria USB-C de 256 GB", "🗂️", 499]
      ],
      "casa-smart": [
        ["sensor-puerta", "Sensor inteligente para puertas", "🚪", 399],
        ["termostato", "Termostato inteligente HomeTemp", "🌡️", 1699],
        ["tira-led", "Tira LED inteligente de 5 metros", "🌈", 699],
        ["timbre-smart", "Timbre con cámara y Wi-Fi", "🔔", 1899],
        ["sensor-movimiento", "Sensor de movimiento SmartSense", "👁️", 549],
        ["cerradura", "Cerradura inteligente con teclado", "🔐", 2799],
        ["sensor-fuga", "Detector inteligente de fugas de agua", "💧", 499],
        ["cortina-smart", "Control inteligente para cortinas", "🪟", 1499],
        ["estacion-clima", "Estación meteorológica conectada", "⛅", 1199],
        ["hub-smart", "Hub central para casa inteligente", "📶", 1299],
        ["alarma-smart", "Alarma inalámbrica para el hogar", "🚨", 2199]
      ],
      telefonos: [
        ["smartphone-mini", "Smartphone Nova Mini · 128 GB", "📱", 8999],
        ["smartphone-plus", "Smartphone Nova Plus · 512 GB", "📱", 15999],
        ["telefono-resistente", "Teléfono resistente Trail X", "📱", 7499],
        ["telefono-basico", "Teléfono práctico Everyday", "📞", 1999],
        ["cargador-inalambrico", "Base de carga inalámbrica Qi", "🔋", 799],
        ["cargador-auto", "Cargador USB-C para automóvil", "🚘", 399],
        ["protector-pantalla", "Protector de pantalla reforzado", "🛡️", 249],
        ["soporte-auto", "Soporte magnético para automóvil", "🚗", 349],
        ["selfie-stick", "Palo selfie Bluetooth extensible", "🤳", 499],
        ["adaptador-audio", "Adaptador USB-C a audio", "🎵", 299],
        ["tripie-telefono", "Tripié compacto para teléfono", "📸", 599]
      ],
      audifonos: [
        ["earbuds-air", "Audífonos True Wireless Air", "🎧", 1599],
        ["audifonos-cable", "Audífonos con cable Studio Basic", "🎵", 399],
        ["headset-gamer", "Headset gamer con micrófono", "🎮", 1799],
        ["audifonos-overear", "Audífonos over-ear Comfort", "🎧", 1299],
        ["audifonos-bass", "Audífonos Bass Boost inalámbricos", "🔊", 1899],
        ["audifonos-viaje", "Audífonos de viaje con estuche", "✈️", 1499],
        ["audifonos-open", "Audífonos deportivos Open Fit", "🏃", 1399],
        ["audifonos-usbc", "Audífonos USB-C con micrófono", "🎙️", 549],
        ["audifonos-mic", "Diadema con micrófono para llamadas", "💬", 899],
        ["audifonos-karaoke", "Audífonos inalámbricos para niños", "🎶", 699],
        ["adaptador-bluetooth", "Adaptador Bluetooth de audio", "📶", 449]
      ],
      bocinas: [
        ["bocina-pocket", "Bocina Bluetooth Pocket", "🔈", 599],
        ["bocina-bass", "Bocina portátil BassBox", "🔊", 1699],
        ["torre-sonido", "Torre de sonido Party Tower", "🎵", 3999],
        ["bocina-pair", "Par de bocinas estéreo para escritorio", "🔉", 1499],
        ["bocina-outdoor", "Bocina Outdoor resistente al agua", "🏕️", 2199],
        ["bocina-karaoke", "Bocina karaoke con micrófono", "🎤", 2499],
        ["bocina-usb", "Bocina USB compacta para PC", "🖥️", 499],
        ["bocina-bateria", "Bocina recargable SoundGo", "🔋", 999],
        ["subwoofer", "Subwoofer compacto para sala", "📢", 2799],
        ["bocina-multiroom", "Bocina Wi-Fi para varias habitaciones", "🏡", 1899],
        ["bocina-retro", "Bocina portátil estilo retro", "📻", 1199]
      ],
      juguetes: [
        ["robot-ciencia", "Robot educativo CodeBuddy", "🤖", 1699],
        ["dron-mini", "Mini dron con cámara para principiantes", "🚁", 1599],
        ["microscopio", "Microscopio digital para pequeños", "🔬", 1199],
        ["peluche-interactivo", "Peluche interactivo con sonidos", "🧸", 899],
        ["auto-terreno", "Auto RC todo terreno", "🏎️", 1399],
        ["globo-interactivo", "Globo terráqueo interactivo", "🌎", 1499],
        ["bloques-electronicos", "Kit de construcción electrónica", "🧩", 999],
        ["tableta-dibujo", "Tableta LCD para dibujar", "🎨", 499],
        ["barco-rc", "Barco a control remoto Splash", "🚤", 1099],
        ["tren-smart", "Tren inteligente programable", "🚂", 1299],
        ["camara-infantil", "Cámara digital infantil", "📷", 799]
      ],
      videojuegos: [
        ["misterio-pixel", "Misterio Pixel · Aventura interactiva", "🕵️", 899],
        ["carreras-neon", "Carreras Neón · Competencia arcade", "🏎️", 1099],
        ["reinos-fantasia", "Reinos de Fantasía · RPG", "🐉", 1299],
        ["isla-coop", "Isla Cooperativa · Juego familiar", "🏝️", 999],
        ["ritmo-total", "Ritmo Total · Edición musical", "🎸", 1199],
        ["estrategia-galactica", "Frontera Galáctica · Estrategia", "🌌", 1099],
        ["plataformas", "Salto Estelar · Plataformas", "⭐", 849],
        ["deportes-extremos", "Deportes Extremos · Acción", "🛹", 1199],
        ["simulador-ciudad", "Mi Ciudad · Simulador creativo", "🏙️", 949],
        ["aventura-submarina", "Aventura Submarina · Exploración", "🐠", 899],
        ["coleccion-retro", "Colección Retro Arcade", "👾", 799]
      ],
      consolas: [
        ["consola-nova-digital", "Nova Play Digital · 1 TB", "🎮", 10999],
        ["consola-handheld", "PocketPlay OLED portátil", "🕹️", 7999],
        ["consola-retro-pro", "Arcade Mini Retro · 300 juegos", "👾", 2299],
        ["consola-familiar-pro", "Motion Fun · Kit familiar", "🎯", 8999],
        ["consola-stream", "Consola Stream Box 4K", "📺", 4999],
        ["consola-compacta", "Nova Play Compact · 512 GB", "🎮", 8999],
        ["consola-portatil-lite", "PocketPlay Lite portátil", "🎮", 5499],
        ["consola-arcade", "Arcade Station sobremesa", "🕹️", 3499],
        ["consola-retro-pocket", "Retro Pocket portátil", "👾", 1699],
        ["consola-fitness", "Motion Fun Fitness Edition", "🏃", 9299],
        ["consola-bundle", "Nova Play con juego incluido", "🎁", 12499]
      ],
      controles: [
        ["control-blanco", "Control inalámbrico Nova · Blanco", "🎮", 1399],
        ["control-elite", "Control Nova Elite con palancas", "🕹️", 2299],
        ["control-usb", "Control USB para computadora", "🎮", 599],
        ["volante", "Volante de carreras con pedales", "🏁", 3499],
        ["fight-stick", "Arcade Fight Stick USB", "👾", 1899],
        ["control-movil", "Control telescópico para móvil", "📱", 1199],
        ["base-carga", "Base de carga doble para controles", "🔋", 699],
        ["control-inalambrico-pc", "Control inalámbrico para PC", "🕹️", 999],
        ["control-compacto", "Control compacto Bluetooth", "🎮", 849],
        ["palanca-arcade", "Palanca arcade con botones", "🕹️", 1499],
        ["control-accesible", "Control adaptable de fácil agarre", "♿", 1299]
      ]
    };

    const descriptionTemplates = {
      electrodomesticos: [
        "Una ayuda práctica para hacer más sencilla tu rutina en casa.",
        "Diseño funcional y cómodo para el uso de todos los días.",
        "Una forma simple de renovar tu espacio y ahorrar tiempo."
      ],
      computacion: [
        "Una herramienta confiable para trabajar, estudiar o crear.",
        "Diseñado para acompañar tus tareas diarias con comodidad.",
        "Conecta tus ideas con un equipo práctico y funcional."
      ],
      "casa-smart": [
        "Agrega comodidad y control inteligente a tu hogar.",
        "Una manera práctica de automatizar tu espacio.",
        "Conecta tus rutinas y disfruta una casa más cómoda."
      ],
      telefonos: [
        "Accesorio práctico para acompañarte en casa y donde vayas.",
        "Mantén tu teléfono listo y protegido durante el día.",
        "Diseño compacto pensado para el uso cotidiano."
      ],
      audifonos: [
        "Disfruta tu música, llamadas y contenido con comodidad.",
        "Una opción versátil para escuchar en casa o al salir.",
        "Diseñados para acompañar tus sesiones favoritas."
      ],
      bocinas: [
        "Llena tu espacio de música para cada momento.",
        "Sonido práctico para compartir en casa o al aire libre.",
        "Lleva tus canciones favoritas contigo."
      ],
      juguetes: [
        "Invita a explorar, crear y aprender jugando.",
        "Una opción entretenida para despertar la imaginación.",
        "Diversión interactiva para compartir y descubrir."
      ],
      videojuegos: [
        "Una aventura para disfrutar en tus momentos de juego.",
        "Explora nuevos mundos y reta tus habilidades.",
        "Diversión para jugar a tu ritmo o compartir."
      ],
      consolas: [
        "Disfruta tus juegos favoritos en casa o donde quieras.",
        "Una plataforma versátil para jugar y compartir.",
        "Prepárate para nuevas aventuras y experiencias."
      ],
      controles: [
        "Agarre cómodo y respuesta para tus sesiones de juego.",
        "Una forma práctica de jugar en tus plataformas favoritas.",
        "Control preciso para disfrutar cada partida."
      ]
    };

    const specificationProfiles = {
      electrodomesticos: [["Uso recomendado", "Hogar"], ["Alimentación", "Eléctrica (consultar modelo)"], ["Garantía", "12 meses, referencial"]],
      computacion: [["Uso recomendado", "Casa u oficina"], ["Conexión", "Consultar puertos y compatibilidad del modelo"], ["Garantía", "12 meses, referencial"]],
      "casa-smart": [["Conectividad", "Wi-Fi o Bluetooth, según el modelo"], ["Compatibilidad", "Revisar app y ecosistema compatible"], ["Garantía", "12 meses, referencial"]],
      telefonos: [["Compatibilidad", "Verificar modelo y puerto del dispositivo"], ["Uso", "Accesorio para teléfono móvil"], ["Garantía", "12 meses, referencial"]],
      audifonos: [["Conexión", "Bluetooth o cable, según el modelo"], ["Uso recomendado", "Música, llamadas o entretenimiento"], ["Garantía", "12 meses, referencial"]],
      bocinas: [["Conexión", "Bluetooth, Wi-Fi o cable, según el modelo"], ["Uso recomendado", "Interior o exterior, según el modelo"], ["Garantía", "12 meses, referencial"]],
      juguetes: [["Uso recomendado", "Revisar edad sugerida en el empaque"], ["Alimentación", "Consultar si incluye baterías o cargador"], ["Garantía", "Consultar condiciones del fabricante"]],
      videojuegos: [["Formato", "Físico o digital, según edición"], ["Compatibilidad", "Confirmar plataforma antes de comprar"], ["Idioma y edad", "Consultar clasificación del título"]],
      consolas: [["Almacenamiento y puertos", "Varían según el modelo"], ["Conectividad", "Consultar especificaciones del fabricante"], ["Garantía", "12 meses, referencial"]],
      controles: [["Conexión", "USB o inalámbrica, según el modelo"], ["Compatibilidad", "Confirmar plataforma y sistema operativo"], ["Garantía", "12 meses, referencial"]]
    };

    for (const category of categories) {
      const extras = additionalProducts[category.id].map(([id, name, emoji, price], index) => ({
        id,
        name,
        emoji,
        price,
        badge: index === 0 ? "Nuevo" : "",
        rating: ["4.8", "4.7", "4.9", "4.6"][index % 4],
        reviews: 28 + ((index * 17) % 120)
      }));
      category.products.push(...extras);
      category.products.forEach((product, index) => {
        product.description = `${product.name}. ${descriptionTemplates[category.id][index % 3]}`;
      });
    }

    const requestedCategoryId = new URLSearchParams(window.location.search).get("categoria");
    const activeCategory = categories.find((category) => category.id === requestedCategoryId);

    const money = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0
    });

    const productSections = document.querySelector("#product-sections");
    const searchInput = document.querySelector("#product-search");
    const noResults = document.querySelector("#no-results");
    const categoryTrigger = document.querySelector("#category-trigger");
    const categoryDropdown = document.querySelector("#category-dropdown");
    const cartButton = document.querySelector("#cart-button");
    const cartPanel = document.querySelector("#cart-panel");
    const cartCount = document.querySelector("#cart-count");
    const cartItems = document.querySelector("#cart-items");
    const cartTotal = document.querySelector("#cart-total");
    const toast = document.querySelector("#toast");
    const specDialog = document.querySelector("#spec-dialog");
    const specTitle = document.querySelector("#spec-title");
    const specDescription = document.querySelector("#spec-description");
    const specList = document.querySelector("#spec-list");
    const pageSize = 5;
    const cartStorageKey = "voltio.cart.v1";
    const cart = loadCart();
    const categoryPages = new Map();
    let toastTimer;

    function createElement(tagName, className, text) {
      const element = document.createElement(tagName);
      if (className) element.className = className;
      if (text !== undefined) element.textContent = text;
      return element;
    }

    function createProductCard(category, product) {
      const card = createElement("article", "product-card");
      card.dataset.productId = product.id;
      card.dataset.search = `${category.name} ${product.name} ${product.description}`.toLocaleLowerCase("es-MX");

      const artwork = createElement("div", "product-art");
      if (product.badge) artwork.append(createElement("span", "badge", product.badge));
      artwork.append(createElement("span", "product-emoji", product.emoji));
      artwork.lastElementChild.setAttribute("aria-hidden", "true");

      const info = createElement("div", "product-info");
      info.append(createElement("p", "product-category", category.name));
      info.append(createElement("h4", "", product.name));
      info.append(createElement("p", "product-description", product.description));

      const rating = createElement("p", "rating");
      rating.setAttribute("aria-label", `Calificación ${product.rating} de 5`);
      rating.append(document.createTextNode("★★★★★ "));
      rating.append(createElement("span", "", `${product.rating} (${product.reviews})`));
      info.append(rating);

      const tools = createElement("div", "product-tools");
      const productBottom = createElement("div", "product-bottom");
      productBottom.append(createElement("span", "price", money.format(product.price)));

      const addButton = createElement("button", "add-button", "+");
      addButton.type = "button";
      addButton.dataset.productId = product.id;
      addButton.setAttribute("aria-label", `Agregar ${product.name} al carrito`);
      addButton.title = "Agregar al carrito";
      productBottom.append(addButton);

      const specificationsButton = createElement("button", "spec-button", "Ver especificaciones");
      specificationsButton.type = "button";
      specificationsButton.dataset.specId = product.id;

      tools.append(productBottom, specificationsButton);
      info.append(tools);
      card.append(artwork, info);
      return card;
    }

    function renderProducts() {
      const sections = categories.map((category) => {
        const section = createElement("section", "category-section");
        section.id = category.id;
        section.setAttribute("aria-labelledby", `title-${category.id}`);

        const title = createElement("h3", "category-title");
        title.id = `title-${category.id}`;
        const emoji = createElement("span", "emoji", category.emoji);
        emoji.setAttribute("aria-hidden", "true");
        title.append(emoji, document.createTextNode(category.name));

        const count = createElement("small");
        const countLink = createElement("a", "category-count-link", `${category.products.length} productos`);
        countLink.href = `?categoria=${encodeURIComponent(category.id)}`;
        count.append(countLink);
        title.append(count);

        const grid = createElement("div", "product-grid");
        category.products.forEach((product) => grid.append(createProductCard(category, product)));

        const pagination = createElement("nav", "pagination");
        pagination.dataset.paginationFor = category.id;
        pagination.setAttribute("aria-label", `Paginación de ${category.name}`);

        const status = createElement("p", "pagination-status");
        status.dataset.statusFor = category.id;

        section.append(title, grid, pagination, status);
        return section;
      });

      productSections.replaceChildren(...sections);
    }

    function createPageButton(label, categoryId, attributes = {}) {
      const button = createElement("button", "", label);
      button.type = "button";
      button.dataset.categoryId = categoryId;
      Object.entries(attributes).forEach(([name, value]) => {
        if (name === "disabled") button.disabled = value;
        else if (name === "ariaCurrent") {
          if (value) button.setAttribute("aria-current", value);
        }
        else button.dataset[name] = value;
      });
      return button;
    }

    function loadCart() {
      try {
        const savedCart = window.localStorage.getItem(cartStorageKey);
        if (!savedCart) return new Map();

        const entries = JSON.parse(savedCart);
        const validProductIds = new Set(categories.flatMap((category) => category.products.map((product) => product.id)));
        if (!Array.isArray(entries)) throw new TypeError("El contenido guardado del carrito no es válido.");

        const validEntries = entries.filter(([productId, quantity]) =>
          validProductIds.has(productId) && Number.isInteger(quantity) && quantity > 0 && quantity <= 99
        );
        return new Map(validEntries);
      } catch (error) {
        console.error("[Voltio] No se pudo recuperar el carrito guardado.", error);
        return new Map();
      }
    }

    function saveCart() {
      try {
        window.localStorage.setItem(cartStorageKey, JSON.stringify([...cart.entries()]));
      } catch (error) {
        console.error("[Voltio] No se pudo guardar el carrito.", error);
        showToast("No se pudo guardar el carrito en este navegador.");
      }
    }

    function updateCatalog(query = searchInput.value.trim().toLocaleLowerCase("es-MX")) {
      let totalMatches = 0;

      for (const category of categories) {
        const section = document.querySelector(`#${category.id}`);
        if (activeCategory && category.id !== activeCategory.id) {
          section.hidden = true;
          continue;
        }
        const matchingProducts = category.products.filter((product) =>
          `${category.name} ${product.name} ${product.description}`.toLocaleLowerCase("es-MX").includes(query)
        );
        totalMatches += matchingProducts.length;
        section.hidden = matchingProducts.length === 0;
        const productLabel = matchingProducts.length === 1 ? "producto" : "productos";
        section.querySelector(".category-count-link").textContent = `${matchingProducts.length} ${productLabel}`;

        const pageCount = Math.ceil(matchingProducts.length / pageSize);
        const page = Math.min(categoryPages.get(category.id) || 1, Math.max(pageCount, 1));
        categoryPages.set(category.id, page);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const visibleProductIds = new Set(matchingProducts.slice(startIndex, endIndex).map((product) => product.id));

        section.querySelectorAll(".product-card").forEach((card) => {
          card.hidden = !visibleProductIds.has(card.dataset.productId);
        });

        const pagination = section.querySelector(".pagination");
        const status = section.querySelector(".pagination-status");
        pagination.hidden = pageCount <= 1;
        const pageButtons = Array.from({ length: pageCount }, (_, index) => {
          const pageNumber = index + 1;
          const button = createPageButton(String(pageNumber), category.id, {
            page: String(pageNumber),
            ariaCurrent: pageNumber === page ? "page" : ""
          });
          button.setAttribute("aria-label", `Página ${pageNumber}`);
          return button;
        });
        const pageList = createElement("span", "pagination-pages");
        pageList.append(...pageButtons);
        pagination.replaceChildren(
          createPageButton("← Atrás", category.id, { pageAction: "previous", disabled: page === 1 }),
          pageList,
          createPageButton("Siguiente →", category.id, { pageAction: "next", disabled: page === pageCount })
        );

        const firstItem = matchingProducts.length === 0 ? 0 : startIndex + 1;
        const lastItem = Math.min(endIndex, matchingProducts.length);
        status.textContent = matchingProducts.length
          ? `Mostrando ${firstItem}–${lastItem} de ${matchingProducts.length} productos`
          : "";
      }

      noResults.classList.toggle("is-visible", totalMatches === 0);
    }

    function showToast(text) {
      toast.textContent = text;
      toast.classList.add("is-visible");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
    }

    function findProduct(productId) {
      for (const category of categories) {
        const product = category.products.find((item) => item.id === productId);
        if (product) return { ...product, category: category.name };
      }
      return null;
    }

    function showSpecifications(productId) {
      const category = categories.find((item) => item.products.some((product) => product.id === productId));
      const product = category?.products.find((item) => item.id === productId);
      if (!category || !product) return;

      specTitle.textContent = product.name;
      specDescription.textContent = product.description;
      const specifications = [
        ["Categoría", category.name],
        ["Precio", money.format(product.price)],
        ...specificationProfiles[category.id]
      ];
      const rows = specifications.flatMap(([label, value]) => [
        createElement("dt", "", label),
        createElement("dd", "", value)
      ]);
      specList.replaceChildren(...rows);
      specDialog.showModal();
    }

    function addToCart(productId, amount = 1) {
      const current = cart.get(productId) || 0;
      const next = current + amount;
      if (next <= 0) {
        cart.delete(productId);
      } else {
        cart.set(productId, next);
      }
      saveCart();
      renderCart();
    }

    function renderCart() {
      const totalItems = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
      let totalPrice = 0;
      cartCount.textContent = String(totalItems);
      cartButton.setAttribute("aria-label", `Carrito, ${totalItems} ${totalItems === 1 ? "artículo" : "artículos"}`);

      if (cart.size === 0) {
        cartItems.replaceChildren(createElement("p", "cart-empty", "Tu carrito está vacío. ¡Explora la tienda!"));
      } else {
        const itemElements = [...cart.entries()].map(([id, quantity]) => {
          const product = findProduct(id);
          if (!product) return null;
          totalPrice += product.price * quantity;
          const item = createElement("div", "cart-item");
          const emoji = createElement("span", "cart-item-emoji", product.emoji);
          emoji.setAttribute("aria-hidden", "true");

          const details = createElement("div", "cart-item-details");
          details.append(
            createElement("strong", "", product.name),
            createElement("span", "", `${money.format(product.price)} c/u`)
          );

          const quantityControl = createElement("div", "quantity-control");
          quantityControl.setAttribute("aria-label", `Cantidad de ${product.name}`);
          const decreaseButton = createCartButton("decrease", id, "−", "Quitar una unidad");
          const increaseButton = createCartButton("increase", id, "+", "Agregar una unidad");
          quantityControl.append(decreaseButton, createElement("span", "", String(quantity)), increaseButton);
          item.append(emoji, details, quantityControl);
          return item;
        }).filter(Boolean);
        cartItems.replaceChildren(...itemElements);
      }

      cartTotal.textContent = money.format(totalPrice);
    }

    function createCartButton(action, productId, label, accessibleName) {
      const button = createElement("button", "", label);
      button.type = "button";
      button.dataset.cartAction = action;
      button.dataset.productId = productId;
      button.setAttribute("aria-label", accessibleName);
      return button;
    }

    function setCategoryMenu(open) {
      categoryTrigger.setAttribute("aria-expanded", String(open));
      categoryDropdown.classList.toggle("is-open", open);
    }

    function setCartOpen(open) {
      cartButton.setAttribute("aria-expanded", String(open));
      cartPanel.classList.toggle("is-open", open);
      cartPanel.setAttribute("aria-hidden", String(!open));
      if (open) document.querySelector("#close-cart").focus();
    }

    function configureCategoryPage() {
      if (!activeCategory) return;

      document.body.classList.add("category-page");
      document.querySelector(".hero").hidden = true;
      document.querySelector(".benefits").hidden = true;
      document.querySelector("#category-back").hidden = false;
      document.querySelector(".section-heading .kicker").textContent = "Explora la categoría";
      const catalogTitle = document.querySelector("#catalog-title");
      const pageTitle = createElement("h1", "", activeCategory.name);
      pageTitle.id = catalogTitle.id;
      catalogTitle.replaceWith(pageTitle);
      document.querySelector(".section-heading > p").textContent =
        `Descubre los 15 productos de ${activeCategory.name} y revisa sus especificaciones.`;
      document.title = `${activeCategory.name} | Voltio`;
    }

    renderProducts();
    renderCart();
    configureCategoryPage();
    updateCatalog();

    categoryTrigger.addEventListener("click", () => {
      setCategoryMenu(categoryTrigger.getAttribute("aria-expanded") !== "true");
    });

    categoryDropdown.addEventListener("click", (event) => {
      if (event.target.closest("a")) setCategoryMenu(false);
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".category-menu")) setCategoryMenu(false);
      if (!event.target.closest("#cart-panel, #cart-button")) setCartOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (specDialog.open) {
          event.preventDefault();
          specDialog.close();
          return;
        }
        const categoryMenuWasOpen = categoryTrigger.getAttribute("aria-expanded") === "true";
        const cartWasOpen = cartButton.getAttribute("aria-expanded") === "true";
        setCategoryMenu(false);
        setCartOpen(false);
        if (cartWasOpen) cartButton.focus();
        else if (categoryMenuWasOpen) categoryTrigger.focus();
      }
    });

    productSections.addEventListener("click", (event) => {
      const pageControl = event.target.closest("[data-page-action], [data-page]");
      if (pageControl) {
        const categoryId = pageControl.dataset.categoryId;
        const currentPage = categoryPages.get(categoryId) || 1;
        const nextPage = pageControl.dataset.page
          ? Number(pageControl.dataset.page)
          : currentPage + (pageControl.dataset.pageAction === "next" ? 1 : -1);
        categoryPages.set(categoryId, Math.max(1, nextPage));
        updateCatalog();
        return;
      }

      const specButton = event.target.closest("[data-spec-id]");
      if (specButton) {
        showSpecifications(specButton.dataset.specId);
        return;
      }

      const addButton = event.target.closest(".add-button");
      if (!addButton) return;
      const product = findProduct(addButton.dataset.productId);
      if (!product) return;
      addToCart(product.id);
      showToast(`${product.name} se agregó al carrito.`);
    });

    cartItems.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cart-action]");
      if (!button) return;
      const change = button.dataset.cartAction === "increase" ? 1 : -1;
      addToCart(button.dataset.productId, change);
    });

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLocaleLowerCase("es-MX");
      for (const category of categories) categoryPages.set(category.id, 1);
      updateCatalog(query);
    });

    cartButton.addEventListener("click", () => {
      setCartOpen(cartButton.getAttribute("aria-expanded") !== "true");
    });

    document.querySelector("#close-cart").addEventListener("click", () => {
      setCartOpen(false);
      cartButton.focus();
    });

    document.querySelector("#close-specs").addEventListener("click", () => specDialog.close());

    document.querySelector("#checkout-button").addEventListener("click", () => {
      if (cart.size === 0) {
        showToast("Agrega algún producto antes de continuar.");
        return;
      }
      showToast("¡Gracias! El proceso de compra es una demostración.");
    });
