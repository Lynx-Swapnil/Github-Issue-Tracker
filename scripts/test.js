fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then(response => response.json())
    .then(data => {
        const allIssues = data.data;
        const closedIssues = allIssues.filter(issue => issue.status === 'closed');
        console.log(closedIssues);
    });