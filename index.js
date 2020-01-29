// 'use strict';

// import { prompt } from 'inquirer';
// import { writeFile } from 'fs';
// import { promisify } from 'util';
// import prompts from './prompts';

// const writeFileAsync = promisify(writeFile);

// function promptUser() {
//   return prompt(prompts);
// }

// function generateHTML(answers) {
//   return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta http-equiv="X-UA-Compatible" content="ie=edge">
//   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
//   <title>Document</title>
// </head>
// <body>
//   <div class="jumbotron jumbotron-fluid">
//   <div class="container">
//     <h1 class="display-4">Hi! My name is ${answers.name}</h1>
//     <p class="lead">I am from ${answers.location}.</p>
//     <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
//     <ul class="list-group">
//       <li class="list-group-item">My GitHub username is ${answers.github}</li>
//       <li class="list-group-item">LinkedIn: ${answers.linkedin}</li>
//     </ul>
//   </div>
// </div>
// </body>
// </html>`;
// }

// async function init() {
//   console.log('initializing...');
//   try {
//     const answers = await promptUser();

//     const html = generateHTML(answers);

//     await writeFileAsync('index.html', html);

//     console.log('Successfully wrote to index.html');
//   } catch (err) {
//     console.error(err);
//   }
// }

// init();



// 'use strict';

// const fs = require('fs');
// const axios = require('axios');
// const inquirer = require('inquirer');

// inquirer
//   .prompt({
//     message: 'Enter your GitHub username:',
//     name: 'username'
//   })
//   .then(({ username }) => {
//     const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

//     axios.get(queryUrl).then(res => {
//       const repoNames = res.data.map(repo => repo.name);

//      repoNames = repoNames.join('\n');

//       fs.writeFile('repos.txt', repoNames, err => {
//         if (err) {
//           throw err;
//         }

//         console.log(`Saved ${repoNames.length} repos`);
//       });
//     });
//   });

