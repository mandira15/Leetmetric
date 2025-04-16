document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-button");
    const usernameInput = document.getElementById("username-input");
    const result = document.getElementById("result");
    const statsContainer = document.getElementById("stats-container");
    const easyProgressCircle = document.getElementById("easy-progress-circle");
    const mediumProgressCircle = document.getElementById("medium-progress-circle");
    const hardProgressCircle = document.getElementById("hard-progress-circle");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector("stats-cards");
    //return true or false based on a regex
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_]+$/;
        const isMatching = regex.test(username);
        return isMatching;

    }

    async function fetchUserDetails(username) {

        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            const proxyUrl = 'https://proxy.cors.sh/https://leetcode.com/graphql';

            //const targetUrl = "https://leetcode.com/graphql";
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");
            myHeaders.append("x-cors-api-key", "temp_89dc46b3f27e8f9a5f44af72519a4108");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            });
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: graphql,
                redirect: 'follow'
            };
            const response = await fetch(proxyUrl , requestOptions);
            if (!response.ok) {
                throw new Error("Unable to fetch the user details");
            }
            const parseData = await response.json();
            console.log("API Response:", parseData);
            displayUserData(parseData);
        }
        
        catch (error) {
            console.error("Fetch Error:", error);
            statsContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }
    function updateProgressCircle(solved,total,label,circle) {
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
        typeLabel.textContent = label.textContent;
    }

    function displayUserData(parseData){
        const totalQues = parseData.data.allQuestionsCount[0].count;
        const easyQues = parseData.data.allQuestionsCount[1].count;
        const mediumQues = parseData.data.allQuestionsCount[2].count;
        const hardQues = parseData.data.allQuestionsCount[3].count;

        const totalSubmissions = parseData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const easySubmissions = parseData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const mediumSubmissions = parseData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const hardSubmissions = parseData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgressCircle(easySubmissions,easyQues,easyLabel,easyProgressCircle);
        updateProgressCircle(mediumSubmissions,mediumQues,mediumLabel,mediumProgressCircle);
        updateProgressCircle(hardSubmissions,hardQues,hardLabel,hardProgressCircle);
    
        const cardsData = [
            {label: "Total Submissions", value: parseData.data.matchedUser.submitStats[0].acSubmissionNum},
            {label: "Total Easy Submissions", value: parseData.data.matchedUser.submitStats[1].acSubmissionNum},
            {label: "Total Medium Submissions", value: parseData.data.matchedUser.submitStats[2].acSubmissionNum},
            {label: "Total Hard Submissions", value: parseData.data.matchedUser.submitStats[3].acSubmissionNum},

        ];
        console.log("Card Data:", cardsData);

        cardStatsContainer.innerHTML = cardsData.map(
            data => {
                return `
                    <div class="card">
                    <h3>`
                

            }
        ); 
    }
    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        console.log("Logging username", username);
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }


    })
})
