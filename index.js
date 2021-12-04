import express from "express";
import bodyParser from 'body-parser';
import path from "path";
import https from 'https';
import fetch from 'node-fetch';


const app = express();
    const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Accept, Authorization'
    };
    const login = 'tatiana.shirshikova';

    app
    .all('/login/', (req, resp) => {
        resp.set(CORS);
        resp.send(login);
        })

    .get("/", function (req, resp) {
            const tempPath1 = path.resolve();
            resp.sendFile(path.join(tempPath1, "/public/index.html"));
        })
    .use(bodyParser.urlencoded({ extended: true }))
    .get("/wordpress/", async (req, resp) => {
        // Get content
        const content = req.query.content;     
        
        // Get token
        const getToken = await fetch("https://wordpress.kodaktor.ru/wp-json/jwt-auth/v1/token", {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: "gossjsstudent2017", password: "|||123|||456" }),
        });

        const { token } = await getToken.json();
        
        
        const createPost = await fetch("https://wordpress.kodaktor.ru/wp-json/wp/v2/posts", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                'status': 'publish',
                'title': login,
                'content': content
            })
      });
      const { id } = await createPost.json();
        resp.set(CORS);
        resp.send(JSON.stringify(id));
    })
    .listen(process.env.PORT || 4322);
