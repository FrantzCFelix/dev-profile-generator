// 'use strict';

const prompts = require('./prompts');
const fs = require('fs');
const axios = require('axios');
const inquirer = require('inquirer');
const util = require('util');

// const writeFileAsync = promisify(writeFile);

async function promptUser() {
    let githubInfo;
    try {
        const { github } = await inquirer.prompt(prompts);
        const queryUrl = `https://api.github.com/users/${github}`;
        const starredQueryUrl = `${queryUrl}/starred`
        githubInfo = await getGithubInfo(queryUrl, starredQueryUrl);
        //console.log(githubInfo[0]);
    }
    catch (err) { console.log(err); }

    return githubInfo;

}
//made two promies run async doubling execution time of retriving information
async function getGithubInfo(profileUrl, starredRepoUrl) {
    let UserProfileInfo = [];
    try {
        const githubProfile = axios.get(profileUrl);
        const starredRepos = axios.get(starredRepoUrl);
        UserProfileInfo = await Promise.all([githubProfile, starredRepos]);
    }
    catch (err) { console.log(err); }

    return UserProfileInfo;

}

promptUser().then(val => {

    console.log(val[0]);
    console.log(val[1]);
});




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

//     axios.get(queryUrl).then(res => {});
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

