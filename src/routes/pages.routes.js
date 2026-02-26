const express = require("express");
const router = express.Router();

const repo = require("../lib/projects.repository");

// GET /
router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// GET /about
router.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// GET /projects?q=term
router.get("/projects", async (req, res) => {
  if (!res.locals.dbReady) {
    return res.status(500).render("db-error", { error: res.locals.dbError });
  }

  const q = (req.query.q || "").trim();
  const tag = (req.query.tag || "").trim();

  const projects = await repo.getActiveProjects({ q, tag });
  res.render("projects", {
    title: "Projects",
    projects,
    q,
    tag,
    heading: "Projects",
  });
});

router.get("/projects/category/:slug", async (req, res) => {
  if (!res.locals.dbReady) {
    return res.status(500).render("db-error", { error: res.locals.dbError });
  }

  const q = (req.query.q || "").trim();
  const tag = (req.query.tag || "").trim();

  const category = await repo.getCategoryBySlug(req.params.slug);
  if (!category) {
    return res
      .status(404)
      .render("404", { title: "Not Found", path: req.originalUrl });
  }

  const projects = await repo.getActiveProjects({
    q,
    tag,
    categoryId: category._id,
  });
  res.render("projects", {
    title: `Projects = ${category.name}`,
    projects,
    q,
    tag,
    heading: `Projects in ${category.name}`,
  });
});

// GET /projects/:slug
router.get("/projects/:slug", async (req, res) => {
  if (!res.locals.dbReady) {
    return res.status(500).render("db-error", { error: res.locals.dbError });
  }

  const project = await repo.findBySlug(req.params.slug);

  if (!project || project.isActive !== true) {
    return res
      .status(404)
      .render("404", { title: "Not Found", path: req.originalUrl });
  }

  const otherProjects = (await repo.getActiveProjects()).filter(
    (p) => p.slug !== project.slug,
  );

  res.render("project-details", {
    title: project.title,
    project,
    otherProjects,
    layout: "layouts/layout-sidebar",
  });
});

// GET /contact
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

// POST /contact
router.post("/contact", (req, res) => {
  console.log("CONTACT SUBMISSION: ", req.body);

  res.render("contact-success", {
    title: `Thank you, ${req.body.name}! We have received your message.`,
    data: req.body,
  });
});

router.get("/404", (req, res) => {
  res.status(404).render("404", { title: "Not Found", path: req.originalUrl });
});

module.exports = router;
