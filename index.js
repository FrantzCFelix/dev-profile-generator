// 'use strict';

const prompts = require('./prompts');
const fs = require('fs');
const axios = require('axios');
const inquirer = require('inquirer');
const util = require('util');
const writeFileAsync = util.promisify(fs.writeFile);
const puppeteer = require('puppeteer');
const path = require('path');

async function promptUser() {
    let githubInfo;
    try {
        const { github } = await inquirer.prompt(prompts);
        //const { linkedin } = await inquirer.prompt(prompts);
        //const { color } = await inquirer.prompt(prompts);

        const queryUrl = `https://api.github.com/users/${github}`;
        const starredQueryUrl = `${queryUrl}/starred`
        githubInfo = await getGithubInfo(queryUrl, starredQueryUrl);
        // changeColor(color);
        //....(linkedin);
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

promptUser().then(res => {

    let { public_repos } = res[0].data;
    let { followers } = res[0].data;
    let { following } = res[0].data;
    let { name } = res[0].data;
    let { blog } = res[0].data;
    let { location } = res[0].data;
    let { bio } = res[0].data;
    let { avatar_url } = res[0].data;
    let { html_url } = res[0].data;
    let githubStars = res[1].data.length;

    const answerObj = {
        public_repos: public_repos,
        followers: followers,
        following: following,
        name: name,
        blog: blog,
        location: location,
        bio: bio,
        avatar_url: avatar_url,
        githubStars: githubStars,
        html_url: html_url
    }
    console.log(answerObj);
    generateHTML(answerObj);
    //console.log(public_repos, followers, following, name, blog, location, bio, githubStars);
});


async function generateHTML(answers) {
    try {
        const html = `
        <!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hello Bulma!</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.8.0/css/bulma.min.css">
    <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
    <link rel="stylesheet" href="./style/style.css">
    <!-- <link rel="stylesheet" href="style/debug.css"> -->
</head>

<body>
    <section class="section hero is-primary is-small">
        <div class="hero-body">
            <article class="media">

                <div class='column is-12 has-text-centered'>
                    <div class='card equal-height'>
                        <div class='card-content'>
                            <!-- Place image inside .level within your card element -->
                            <nav class="level">
                                <div class="level-item has-text-centered">
                                    <figure class='image is-128x128'><img class = "is-rounded"
                                            src='https://avatars0.githubusercontent.com/u/46702267?v=4'></figure>
                                </div>
                            </nav>
                            <nav class="level">
                                    <div class="level-item has-text-centered">
                                      <h1>Hi!</h1>
                                    </div>
                                </nav>
                                <nav class="level">
                                        <div class="level-item has-text-centered">
                                          <h2>My name is ${answers.name}!</h2>
                                        </div>
                                    </nav>
                                    <nav class="level">
                                            <div class="level-item has-text-centered">
                                              <h3>${answers.bio}</h3>
                                            </div>
                                        </nav>
                            <nav class="level is-mobile">
                  
                                    <div class="level-item">
                                        <a class="level-item">
                                            <span class="icon "><i class="fas fa-location-arrow"></i>${answers.location}</span>
                                        </a>
                                        <a class="level-item">
                                            <span class="icon "><i class="fab fa-github-alt"></i>${answers.html_url}</span>
                                        </a>
                                        <a class="level-item">
                                            <span class="icon "><i class="fas fa-rss"></i>${answers.blog}</span>
                                        </a>
                                    </div>
                                </nav>
                            <!-- And it'll be centered like so -->
                        </div>
                    </div>
                </div>
                
        </div>
       
        </article>
        </div>


    </section>
    <section class="section">
        <div class="container row-1">
            <div class="columns  is-variable is-6">
                <div class="column  is-2">
                </div>
                <div class="column notification is-primary is-3">
                    Public Repositories: ${answers.public_repos}
                </div>
                <div class="column is-1">
                </div>

                <div class="column notification is-primary is-3">
                    Followers: ${answers.followers}
                </div>
                <div class="column is-2">

                </div>
            </div>
        </div>
        <div class="container row-2">
            <div class="columns is-variable is-6">
                <div class="column is-2">
                </div>
                <div class="column notification is-primary is-3">
                    GitHub Stars: ${answers.githubStars}
                </div>
                <div class="column is-1">
                </div>

                <div class="column notification is-primary is-3">
                    Following: ${answers.following}
                </div>
                <div class="column is-2">
                </div>
            </div>
        </div>

        </div>


        <!-- <div class="tile is-ancestor">
                    <div class="column ">
                        <div class="tile is-vertical is-full">
                            <div class="tile is-parent is-vertical ">
                                <article class="tile is-child notification is-danger"> </article>
                            </div>
                            <div class="tile is-parent is-vertical ">
                                <article class="tile is-child notification is-danger"></article>
                            </div>
                        </div>
                    </div>
                    <div class="column ">
                        <div class="tile is-vertical is-full">
                            <div class="tile is-parent is-vertical">
                                <article class="tile is-child notification is-danger"> </article>
                            </div>
                            <div class="tile is-parent is-vertical ">
                                <article class="tile is-child notification is-danger"></article>
                            </div>
                        </div>
                    </div>

                </div> -->


    </section>
    <section class="section has-background-primary">
        <footer class="footer  has-background-primary ">
            <div class="content has-text-centered">
               
            </div>
        </footer>
    </section>
</body>

</html>`;

        await writeFileAsync('index.html', html);
        await printPDF();
    } catch (err) { console.log(err); }
}


 
async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`file://${path.resolve(__dirname, "index.html")}`, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({ format: 'A4' });
  await writeFileAsync('test.pdf', pdf,'binary');
 
  await browser.close();
  return pdf;
}

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

