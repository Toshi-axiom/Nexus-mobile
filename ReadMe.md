# Nexus Mobile - Premium 3D E-Commerce UI

Welcome to the **Nexus Mobile** project! This repository contains a fully responsive, visually stunning e-commerce front-end designed for premium smartphones.

## 🌟 Features

*   **Premium Dark Theme:** A luxurious dark aesthetic utilizing a custom Gold & Sand color palette (`#CBBD93`, `#FAE8B4`, `#80775C`).
*   **Glassmorphism Design:** Modern frosted glass effects on navigation, product cards, and content wrappers.
*   **3D Interactive Particles:** A dynamic HTML5 Canvas background where gold particles shift and react to mouse movement (parallax effect).
*   **Interactive 3D Cards:** Product and feature cards use `VanillaTilt.js` to physically tilt toward the user's cursor, complete with realistic glare reflections.
*   **Smooth Scroll Animations:** Powered by `GSAP` and `ScrollTrigger`, elements gracefully fade and slide into view as the user scrolls down the page.
*   **Responsive Layout:** Fully optimized for mobile, tablet, and desktop devices using CSS Grid and Flexbox.

## 🛠️ Technology Stack

*   **HTML5**
*   **CSS3** (Variables, Grid, Flexbox, Glassmorphism)
*   **Vanilla JavaScript** (ES6+)
*   **[GSAP (GreenSock)](https://greensock.com/)** (Animation & ScrollTrigger)
*   **[VanillaTilt.js](https://micku7zu.github.io/vanilla-tilt.js/)** (3D Hover Effects)

## 📁 Project Structure

*   `index.html`: The main product catalog featuring the top flagship models.
*   `home.html`: The "Buyer's Guide" highlighting key smartphone features and an Editor's Choice section.
*   `about.html`: The Nexus Story and brand manifesto.
*   `contact.html`: Support portal with a contact form and Frequently Asked Questions.
*   `style.css`: All styling, color variables, and responsive media queries.
*   `script.js`: Handles the 3D particle background, initializes VanillaTilt, and manages GSAP scroll animations.

## 🚀 Getting Started

Simply clone this repository and open `index.html` in any modern web browser to experience the site. No build process or local server is strictly required, though using Live Server is recommended for the best experience.

```bash
git clone https://github.com/Toshi-axiom/card-ui.git
```

## 🎨 Color Palette Reference

| Color Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Dark Base** | `#0f0d0a` | Main background (deep warm charcoal) |
| **Cream** | `#FAE8B4` | Primary text and highlights |
| **Sand** | `#CBBD93` | Secondary text, buttons, and borders |
| **Bronze** | `#80775C` | Subtle accents and particle depth |
| **Dark Olive** | `#574A24` | Shadow depths |
