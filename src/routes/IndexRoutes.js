import {Router} from 'express';
import {getRandomImage} from '../controllers/index.js';
import {getProject} from '../controllers/ProjectController.js';
import {loginUser} from '../controllers/AuthController.js';
import {cache} from '../cache.js';

export const IndexRoutes = Router()
  .get('/', async (_, res) => {
    const image = await getRandomImage();

    res.render('home', { pageTitle: 'Home', image: image });
  })

  .get('/projects/:slug', async (req, res) => {
    const {
      params: { slug },
    } = req;

    let project = cache.get(slug);

    if (!project) {
      try {
        const project = await getProject(slug);
        cache.set(slug, project);
      } catch (error) {
        console.log(error);
      }
    }

    project = cache.get(slug);

    const { body } = project;

    res.render('project', { pageTitle: body.title, project: body });
  })

  .get('/content/*', (req, res) => {
    const regex = /\/content\/(.*)\/(.*)\.jpg/g;
    const path = req.path.replace(regex, 'images/$2.webp');

    res
      .writeHead(301, {
        Location: `https://photo.christopherbowers.net/${path}`,
      })
      .end();
  })

  .get('/admin', async (req, res) => {
    if (!req.session.loggedin) {
      res.redirect('/admin/login');
      return;
    }

    res.render('admin', { layout: 'admin' });
  })

  .get('/admin/login', async (_, res) => {
    res.render('login', { layout: 'admin' });
  })

  .post('/admin/login', loginUser)

  .get('/admin/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/admin');
    });
  });
