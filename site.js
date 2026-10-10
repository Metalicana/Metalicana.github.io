document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.bal-container').forEach(function(container) {
        const handle = container.querySelector('.bal-handle');
        if (!handle) return;

        let activePointerId = null;
        let sliderPosition = 50;

        const setSliderPosition = function(percentage) {
            sliderPosition = Math.max(0, Math.min(100, percentage));
            const position = `${sliderPosition}%`;

            container.style.setProperty('--slider-position', position);
            handle.style.left = position;
            handle.setAttribute('aria-valuenow', Math.round(sliderPosition));
            handle.setAttribute('aria-valuetext', `${Math.round(sliderPosition)}% blurry image visible`);
        };

        const setSliderPositionFromPointer = function(event) {
            const rect = container.getBoundingClientRect();
            const x = event.clientX - rect.left;
            setSliderPosition((x / rect.width) * 100);
        };

        const startDrag = function(event) {
            if (event.button !== undefined && event.button !== 0) return;

            handle.focus({ preventScroll: true });
            activePointerId = event.pointerId;
            container.setPointerCapture(activePointerId);
            container.classList.add('is-dragging');
            setSliderPositionFromPointer(event);
            event.preventDefault();
        };

        const drag = function(event) {
            if (event.pointerId !== activePointerId) return;
            setSliderPositionFromPointer(event);
        };

        const stopDrag = function(event) {
            if (event.pointerId !== activePointerId) return;

            if (container.hasPointerCapture(activePointerId)) {
                container.releasePointerCapture(activePointerId);
            }
            activePointerId = null;
            container.classList.remove('is-dragging');
        };

        handle.setAttribute('role', 'slider');
        handle.setAttribute('aria-label', 'Compare blurry and sharp image');
        handle.setAttribute('aria-valuemin', '0');
        handle.setAttribute('aria-valuemax', '100');
        handle.tabIndex = 0;

        container.addEventListener('pointerdown', startDrag);
        container.addEventListener('pointermove', drag);
        container.addEventListener('pointerup', stopDrag);
        container.addEventListener('pointercancel', stopDrag);
        container.addEventListener('lostpointercapture', stopDrag);
        handle.addEventListener('keydown', function(event) {
            const step = event.shiftKey ? 10 : 5;

            if (event.key === 'ArrowLeft') {
                setSliderPosition(sliderPosition - step);
            } else if (event.key === 'ArrowRight') {
                setSliderPosition(sliderPosition + step);
            } else if (event.key === 'Home') {
                setSliderPosition(0);
            } else if (event.key === 'End') {
                setSliderPosition(100);
            } else {
                return;
            }

            event.preventDefault();
        });

        setSliderPosition(sliderPosition);
    });

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
