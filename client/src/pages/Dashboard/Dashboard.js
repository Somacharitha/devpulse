import {
  useState,
  useEffect,
  useRef
} from 'react';

import StatCard from '../../components/StatCard/StatCard';
import RepoCard from '../../components/RepoCard/RepoCard';
import RepoChart from '../../components/Charts/RepoChart';
import LanguageChart from '../../components/Charts/LanguageChart';
import ActivityHeatmap from '../../components/Charts/ActivityHeatmap';

import './Dashboard.css';
import './../../components/Skeleton/Skeleton.css';

import toast from 'react-hot-toast';

function Dashboard({
  username,
  setUsername
}) {

  const [userData, setUserData] =
    useState(null);

  const [repos, setRepos] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedRepo, setSelectedRepo] =
    useState(null);

  const [activeTab, setActiveTab] =
    useState('overview');

  const [error, setError] =
    useState(null);

  const [activityData, setActivityData] =
    useState({});

  const [recentSearches, setRecentSearches] =
    useState([]);

  const [favorites, setFavorites] =
    useState([]);

  const [aiInsights, setAiInsights] =
    useState('');

  const [showFullInsights, setShowFullInsights] =
    useState(false);



  /* =========================
     PARTICLES
  ========================= */

  const canvasRef = useRef(null);



  useEffect(() => {

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');



    const resize = () => {

      canvas.width = window.innerWidth;

      canvas.height =
        document.body.scrollHeight;
    };



    resize();

    window.addEventListener(
      'resize',
      resize
    );



    const particles = Array.from(
      { length: 80 },
      () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35
      })
    );



    const animate = () => {

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );



      particles.forEach((p) => {

        p.x += p.vx;

        p.y += p.vy;



        if (p.x < 0)
          p.x = canvas.width;

        if (p.x > canvas.width)
          p.x = 0;

        if (p.y < 0)
          p.y = canvas.height;

        if (p.y > canvas.height)
          p.y = 0;



        ctx.beginPath();

        ctx.arc(
          p.x,
          p.y,
          p.r,
          0,
          Math.PI * 2
        );



        ctx.fillStyle =
          'rgba(0,255,163,0.25)';

        ctx.fill();
      });





      particles.forEach((a, i) => {

        particles
          .slice(i + 1)
          .forEach((b) => {

            const dist = Math.hypot(
              a.x - b.x,
              a.y - b.y
            );



            if (dist < 120) {

              ctx.beginPath();

              ctx.moveTo(a.x, a.y);

              ctx.lineTo(b.x, b.y);



              ctx.strokeStyle =
                `rgba(0,255,163,${
                  0.06 * (
                    1 - dist / 120
                  )
                })`;



              ctx.lineWidth = 0.5;

              ctx.stroke();
            }
          });
      });



      requestAnimationFrame(
        animate
      );
    };



    animate();



    return () => {

      window.removeEventListener(
        'resize',
        resize
      );
    };

  }, []);





  /* =========================
     FETCH DATA
  ========================= */

  useEffect(() => {

    if (!username) return;



    const fetchData = async () => {

      try {

        setLoading(true);

        setError(null);



        const userRes = await fetch(

          `${process.env.REACT_APP_API_URL}/api/github/user/${username}`
        );



        if (!userRes.ok) {

          setError({
            message: 'User not found'
          });

          return;
        }



        const user =
          await userRes.json();



        const reposRes = await fetch(

          `${process.env.REACT_APP_API_URL}/api/github/repos/${username}`
        );



        const reposData =
          await reposRes.json();



        const eventsRes = await fetch(

          `${process.env.REACT_APP_API_URL}/api/github/events/${username}`
        );



        const events =
          await eventsRes.json();



        setUserData(user);

        setRepos(reposData);

        setActivityData(events);

        setSelectedRepo(
          reposData[0]
        );



        /* RECENT SEARCHES */

        setRecentSearches((prev) => {

          const updated = [

            username,

            ...prev.filter(
              (item) =>
                item !== username
            )
          ];



          return updated.slice(0, 5);
        });





        const aiRes = await fetch(

          `${process.env.REACT_APP_API_URL}/api/github/ai-insights`,

          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              repos:
                reposData.slice(0, 10)
            })
          }
        );



        const aiData =
          await aiRes.json();



        setAiInsights(
          aiData.insights
        );



        fetchFavorites();

      } catch (error) {

        console.log(error);

        setError({
          message:
            'Something went wrong'
        });

      } finally {

        setLoading(false);
      }
    };



    fetchData();

  }, [username]);





  /* =========================
     FAVORITES
  ========================= */

  const fetchFavorites = async () => {

    try {

      const response = await fetch(

        `${process.env.REACT_APP_API_URL}/api/github/favorites?userId=${
          JSON.parse(
            localStorage.getItem('user')
          )?.id
        }`
      );



      const data =
        await response.json();



      setFavorites(data);

    } catch (error) {

      console.log(error);
    }
  };





  /* =========================
     STATS
  ========================= */

  const totalStars = repos.reduce(
    (sum, repo) =>
      sum +
      repo.stargazers_count,
    0
  );



  const totalForks = repos.reduce(
    (sum, repo) =>
      sum +
      repo.forks_count,
    0
  );



  const languageCount = {};



  repos.forEach((repo) => {

    if (repo.language) {

      languageCount[
        repo.language
      ] =

        (languageCount[
          repo.language
        ] || 0) + 1;
    }
  });



  const mostUsedLang =

    Object.keys(languageCount)[0]
      || 'N/A';





  return (

    <div className="dashboard">



      {/* PARTICLES */}

      <canvas
        ref={canvasRef}
        className="dashboard-particles"
      />



      {/* HERO SECTION */}

      {!userData && !loading && (

        <div className="dashboard-hero">

          <div className="hero-glow"></div>



          <h1 className="hero-title">

            Analyze GitHub<br />

            <span className="hero-accent">

              Like Never Before.

            </span>

          </h1>



          <p className="hero-sub">

            Explore developer profiles,
            repositories, AI insights,
            coding activity and tech stack
            with futuristic analytics.

          </p>

        </div>
      )}



      {/* LOADING */}

      {loading && (

        <div className="dashboard-loading">

          <div className="loading-spinner"></div>

        </div>
      )}



      {/* ERROR */}

      {error && (

        <div className="dashboard-error">

          {error.message}

        </div>
      )}



      {/* MAIN CONTENT */}

      {!loading && !error && userData && (

        <>

          {/* PROFILE */}

          <div className="profile-card">

            <img
              src={userData.avatar_url}
              alt={userData.login}
              className="profile-avatar"
            />



            <div className="profile-info">

              <h2 className="profile-name">

                {userData.name ||
                  userData.login}

              </h2>



              <p className="profile-username">

                @{userData.login}

              </p>



              <p className="profile-bio">

                {userData.bio}

              </p>



              <button

                className="repo-detail-link"

                onClick={async () => {

                  try {

                    const response =
                      await fetch(

                        `${process.env.REACT_APP_API_URL}/api/github/favorites`,

                        {

                          method: 'POST',

                          headers: {
                            'Content-Type':
                              'application/json'
                          },

                          body: JSON.stringify({

                            userId: JSON.parse(
                              localStorage.getItem('user')
                            )?.id,

                            username:
                              userData.login,

                            avatar:
                              userData.avatar_url,

                            profileUrl:
                              userData.html_url
                          })
                        }
                      );



                    const data =
                      await response.json();



                    toast.success(

                      data.message ||
                      'Added to favorites'
                    );



                    fetchFavorites();

                  } catch (error) {

                    console.log(error);

                    toast.error(
                      'Failed'
                    );
                  }
                }}
              >

                ⭐ Add to Favorites

              </button>

            </div>

          </div>





          {/* RECENT SEARCHES */}

          {recentSearches.length > 0 && (

            <div className="recent-searches-box">

              <h2>
                Recent Searches
              </h2>



              <div className="recent-searches-list">

                {recentSearches.map((item) => (

                  <button

                    key={item}

                    className="recent-search-btn"

                    onClick={() =>
                      setUsername(item)
                    }
                  >

                    {item}

                  </button>
                ))}

              </div>

            </div>
          )}





          {/* STATS */}

          <div className="stat-cards-grid">

            <StatCard
              title="Repositories"
              value={repos.length}
            />



            <StatCard
              title="Stars"
              value={totalStars}
            />



            <StatCard
              title="Forks"
              value={totalForks}
            />



            <StatCard
              title="Top Language"
              value={mostUsedLang}
            />

          </div>





          {/* FAVORITES */}

          {favorites.length > 0 && (

            <div className="favorites-box">

              <h2>
                Favorites
              </h2>



              <div className="favorites-list">

                {favorites.map((fav) => (

                  <div
                    key={fav._id}
                    className="favorite-card"
                    onClick={() =>
                      setUsername(
                        fav.username
                      )
                    }
                  >

                    <img
                      src={fav.avatar}
                      alt={fav.username}
                      className="profile-avatar"
                    />



                    <span>

                      {fav.username}

                    </span>

                  </div>
                ))}

              </div>

            </div>
          )}





          {/* TABS */}

          <div className="tabs">

            <button

              className={`tab ${
                activeTab === 'overview'
                  ? 'active'
                  : ''
              }`}

              onClick={() =>
                setActiveTab(
                  'overview'
                )
              }
            >

              Overview

            </button>



            <button

              className={`tab ${
                activeTab === 'activity'
                  ? 'active'
                  : ''
              }`}

              onClick={() =>
                setActiveTab(
                  'activity'
                )
              }
            >

              Activity

            </button>

          </div>





          {/* OVERVIEW */}

          {activeTab === 'overview' && (

            <>

              <RepoChart
                repos={repos}
              />



              <LanguageChart
                repos={repos}
              />



              <div className="repos-section">

                <div className="repos-list">

                  {repos.map((repo) => (

                    <RepoCard
                      key={repo.id}
                      repo={repo}
                      selected={
                        selectedRepo?.id ===
                        repo.id
                      }
                      onClick={() =>
                        setSelectedRepo(repo)
                      }
                    />
                  ))}

                </div>





                <div className="repo-detail">

                  {selectedRepo && (

                    <>

                      <div className="repo-detail-header">

                        <h2 className="repo-detail-name">

                          {selectedRepo.name}

                        </h2>



                        <a
                          href={
                            selectedRepo.html_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="repo-detail-link"
                        >

                          Open Repo

                        </a>

                      </div>



                      <p>

                        {selectedRepo.description}

                      </p>

                    </>
                  )}

                </div>

              </div>





              {/* AI INSIGHTS */}

              {aiInsights && (

                <div className="ai-insights-card">

                  <h2>
                    AI Developer Insights
                  </h2>



                  <p>

                    {showFullInsights
                      ? aiInsights
                      : aiInsights.slice(
                          0,
                          300
                        )
                    }

                  </p>



                  {aiInsights.length >
                    300 && (

                    <button

                      className="repo-detail-link"

                      onClick={() =>
                        setShowFullInsights(
                          !showFullInsights
                        )
                      }
                    >

                      {showFullInsights
                        ? 'Show Less'
                        : 'Read Full Insights'
                      }

                    </button>
                  )}

                </div>
              )}

            </>
          )}





          {/* ACTIVITY */}

          {activeTab === 'activity' && (

            <ActivityHeatmap
              activityData={
                activityData
              }
            />
          )}

        </>
      )}

    </div>
  );
}

export default Dashboard;