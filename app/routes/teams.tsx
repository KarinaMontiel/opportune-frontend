import { Form, Link, useLoaderData } from '@remix-run/react';
import loginStyle from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon, StarIcon} from '@heroicons/react/24/outline';
import {StarIcon as SolidStarIcon} from '@heroicons/react/24/solid';
import { useState, useEffect, useRef } from 'react';
import { useCalendlyEventListener, InlineWidget, PopupButton, PopupModal } from "react-calendly";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { getSession, destroySession } from '~/utils/sessions';
import axios from 'axios';
import { Portal } from '@mui/material';
// import { motion } from 'framer-motion';

export async function action({request}: ActionFunctionArgs) {
	const body = await request.formData();
	const _action = body.get("_action");
	console.log(_action);

	const session = await getSession(
		request.headers.get("Cookie")
	);

	if (_action == "LogOut") {
		return redirect("/login", {
			headers: {
			  "Set-Cookie": await destroySession(session),
			},
		});
	}
}

export async function loader({request}: LoaderFunctionArgs) {
	try {
		const session = await getSession(
			request.headers.get("Cookie")
		);

		console.log("Auth: ", session.get("auth"));
		if (!session.get("auth")) {
			return redirect("/login")
		}

		const response = await axios.get(process.env.BACKEND_URL + '/user/list-teams/', {
			headers: {
			  "Authorization": session.get("auth"),
			  "Content-Type": "application/json",
			},
		});

		if (response.status === 200) {
			const data = response.data;
			// console.log(data);
			return json({ data });
		}
	} catch (error) {
		console.log(error);
		return null;
	}
};
        
export default function Teams() {

	const [events, setEvents] = useState([]);

    useCalendlyEventListener({
        onEventScheduled: (event) => {
			fetchEvents(event.data.payload.event.uri);
        }
    });

	const formatTime = (time) => {
		const date = new Date(time);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? 'PM' : 'AM';
		const formattedHours = hours % 12 || 12;
		const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

		const formattedTime = `${formattedHours}:${formattedMinutes}${ampm}`;
		return formattedTime;
	}

	const fetchEvents = async(uri) => {

		const token = "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNjk5MzE0NjM2LCJqdGkiOiJkYjE0NzEwZS04NGM3LTQ0YmEtYTFmOC0wNDQzNjM0ZDgxNzYiLCJ1c2VyX3V1aWQiOiI5MzA0Yzg4OC1mN2E1LTRkZmItYTUzZC1lZjJjNzM5NWJkNWEifQ.f87XL5gBVApxKTQ2Oonlvdxed4zEWCsUvt6qko8qq54SvNJfL08WAqWvGlWARJW06uaOW40PISyBnxQJKWuLOw";

		try {
			const response = await fetch(uri, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
			const data = await response.json();
			setEvents(prev => [...prev, data]);
		} catch (error) {
			console.error(error);
		}
	}

	const teamInfo = useLoaderData<typeof loader>();
	const teamInfoList = teamInfo.data.teams;
	console.log(teamInfoList);
	const [favorites, setFavorites] = useState([]);

	// useEffect(() => {
	// 	const form = document.getElementById('teams-id');
	// 	const data = new FormData(form);
	// 	data.append('favorites', JSON.stringify(favorites));

	// 	fetch('/teams', {
	// 		method: 'GET', 
	// 	});

	// }, [favorites]); 

	const [isOpen, setIsOpen] = useState(false);

	const prefill={
		email: 'test@test.com',
		firstName: 'Jon',
		lastName: 'Snow',
		name: 'Jon Snow',
	}

    return (
        <div id="portal-root" className="flex-container">
            <div id="sidebar">
                <img className="opportune-logo-small" src="opportune_newlogo.svg"></img>
				<Form action="/teams" method="post">
					<button className='logout-button' type="submit" 
					name="_action" value="LogOut">
					<ArrowLeftOnRectangleIcon /> 
					</button>
				</Form>
            </div>
            <div id="content">
                <h2>Welcome Oppenheim </h2>
                <div id="menubar">
                    <MainNavigation />
                </div>

                <div className="horiz-flex-container">
					<form id="teams-id" className="teams-container">
						{teamInfoList.map((team) => {
							const [expanded, setExpanded] = useState(false);

							const [filled, setFilled] = useState(false);

							const toggleFavorite = (teamName) => {
								setFavorites(prev => {
									if (prev.includes(teamName)) {
										return prev.filter(name => name !== teamName); 
									} else {
										return [...prev, teamName];
									}
								});
								setFilled(prev => !prev);
							}

							return <div className="team-box" key={team.name}>
								<div className="team-text">
									<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
										<h3>{team.name}</h3>
										{filled ? (  
											<SolidStarIcon 
												className="favorite-btn"
												onClick={() => toggleFavorite(team.name)} 
											/>
										) : (
											<StarIcon
												className="favorite-btn" 
												onClick={() => toggleFavorite(team.name)}  
											/>
										)}
									</div>
									
									<p> 
										<b>Tools and Technologies: </b>
										{team.skills.map(skills => skills.name).join(", ")}
									</p>
									<p className='read-more-btn' onClick={() => setExpanded(!expanded)}>
										{expanded ? 'Read Less' : 'Read More'}  
									</p>

									{expanded && 
										<div className="expanded-content">
											<div className="text-content">
												<p>Description: {team.description}</p>
											</div>

											<button
												className='schedule-btn'
												onClick={() => setIsOpen(true)}
												type='button'>
												Schedule meeting
											</button>
											{isOpen && 
											<div className='calendly-overlay'>
												<div className='calendly-close-overlay' onClick={() => setIsOpen(false)}></div>
												<div className='calendly-popup'>
													<div className='calendly-popup-content'>
														<InlineWidget url="https://calendly.com/ryanl23" 
															prefill={prefill}
														/>
													</div>
												</div>
											</div>
											}

										</div>
									}
								</div>
							</div>
						})}
					</form>
					<div className="meets-container">
						{events ? events.map((event) => {
							return <div className="team-box">
								<div className="team-text" key={event.resource.name}>
									<h3> {event.resource.name}</h3>
									<p>Date: {new Date(event.resource.start_time).toLocaleDateString()}</p>
									<p>Start Time: {formatTime(event.resource.start_time)}</p>
									<p>End Time: {formatTime(event.resource.end_time)}</p>
								</div>
							</div>
						}) : <p>No events booked yet!</p>}
					</div>
                </div>

                <p className="cta">
                    <Link to="/profile">Previous</Link>
                    <Link to="/matching">Next</Link>
                </p>
            </div>
        </div>
    )
}

export function links() {
    return [{ rel: 'stylesheet', href: loginStyle }];
}