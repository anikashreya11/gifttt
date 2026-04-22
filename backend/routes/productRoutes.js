const express = require("express");

const router = express.Router();

const products = [
  {
    id: "p1",
    name: "Sunrise Keepsake Box",
    category: "memory",
    price: 49.99,
    currency: "USD",
    rating: 4.8,
    etaDays: 2,
    tags: ["custom", "premium", "birthday"],
    description: "Hand-finished gift box with personalized note insert."
  },
  {
    id: "p2",
    name: "Celebration Snack Crate",
    category: "food",
    price: 34.5,
    currency: "USD",
    rating: 4.6,
    etaDays: 1,
    tags: ["same-day", "team", "party"],
    description: "Curated global snacks and celebration treats."
  },
  {
    id: "p3",
    name: "Calm Ritual Hamper",
    category: "wellness",
    price: 59.0,
    currency: "USD",
    rating: 4.9,
    etaDays: 3,
    tags: ["self-care", "mindful", "recharge"],
    description: "Tea, candles, and spa essentials in a reusable basket."
  },
  {
    id: "p4",
    name: "Remote Team Culture Kit",
    category: "corporate",
    price: 79.0,
    currency: "USD",
    rating: 4.7,
    etaDays: 4,
    tags: ["onboarding", "remote", "company"],
    description: "Branded welcome gifts for distributed teams."
  }
];

router.get("/", (req, res) => {
  const { search, category, minPrice, maxPrice, sort } = req.query;

  let result = [...products];

  if (search) {
    const needle = String(search).trim().toLowerCase();
    result = result.filter((item) => {
      return (
        item.name.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle) ||
        item.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    });
  }

  if (category) {
    const normalizedCategory = String(category).trim().toLowerCase();
    result = result.filter((item) => item.category.toLowerCase() === normalizedCategory);
  }

  const min = Number(minPrice);
  if (!Number.isNaN(min)) {
    result = result.filter((item) => item.price >= min);
  }

  const max = Number(maxPrice);
  if (!Number.isNaN(max)) {
    result = result.filter((item) => item.price <= max);
  }

  if (sort === "price_asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === "rating_desc") {
    result.sort((a, b) => b.rating - a.rating);
  }

  return res.status(200).json({
    count: result.length,
    items: result
  });
});

router.get("/:id", (req, res) => {
  const product = products.find((entry) => entry.id === req.params.id);
  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  return res.status(200).json(product);
});

module.exports = router;
