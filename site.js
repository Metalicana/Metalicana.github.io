document.addEventListener('DOMContentLoaded', function() {
    const githubStarCount = document.querySelectorAll('.github-star-count');
    if (githubStarCount.length) {
        const setGitHubStarText = function(text) {
            githubStarCount.forEach(function(element) {
                element.textContent = text;
            });
        };

        const formatStars = function(count) {
            return `${count.toLocaleString()} ${count === 1 ? 'star' : 'stars'}`;
        };

        const loadGitHubStars = async function() {
            let page = 1;
            let totalStars = 0;

            // Include research repositories maintained under organizations that do not
            // appear in the personal-account repository listing.
            const contributedRepositories = [
                'AIM-Research-Lab/Awesome-AI-Agents-Medicine'
            ];

            while (page <= 10) {
                const response = await fetch(`https://api.github.com/users/Metalicana/repos?per_page=100&type=owner&page=${page}`);
                if (!response.ok) throw new Error('GitHub stars unavailable');

                const repos = await response.json();
                totalStars += repos.reduce(function(sum, repo) {
                    return sum + repo.stargazers_count;
                }, 0);

                if (repos.length < 100) break;
                page += 1;
            }

            const contributedResponses = await Promise.all(
                contributedRepositories.map(function(repository) {
                    return fetch(`https://api.github.com/repos/${repository}`);
                })
            );

            for (const response of contributedResponses) {
                if (!response.ok) throw new Error('GitHub stars unavailable');
                const repository = await response.json();
                totalStars += repository.stargazers_count;
            }

            setGitHubStarText(formatStars(totalStars));
        };

        loadGitHubStars().catch(function() {
            setGitHubStarText('stars');
        });
    }
});
