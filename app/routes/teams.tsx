import { Link } from '@remix-run/react';
import loginStyle from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
// import { motion } from 'framer-motion';

const teamInfo = [
	{
		name: "Data Science",
		description: "The Data Science Team is committed to leveraging data-driven approaches to support informed decision-making, optimize processes, and drive innovation within the company. We transform raw data into actionable insights, predictive models, and data products that contribute to the overall success of the organization.",
		tech: "Python, R, scikit-learn, Tensorflow, Pytorch, AWS, Azure, SQL, PowerBI"
	},
	{
		name: "Finance",
		description: "The Finance Team is dedicated to maintaining financial stability, optimizing resource allocation, and providing accurate financial guidance to support the company's growth and sustainability. We are responsible for managing the company's finances, forecasting, and analyzing financial data, and ensuring regulatory compliance.",
		tech: "EXCEL MONKEY EVERYDAY"
	},
	{
		name: "Cybersecurity",
		description: "The Cybersecurity Team is dedicated to protecting the company's digital assets, ensuring the confidentiality, integrity, and availability of data, and mitigating cyber threats. We implement robust security measures, conduct risk assessments, and stay vigilant in defending against evolving cyber threats.",
		tech: "SIEM, IDPS, Antivirus / anti-malware software, encryption tools, vulnerability scanning, IAM platforms",
	}
]

const meetInfo = [
	{
		event: "Chat with Jacob (AI Team)",
		date: "30 June, 2023",
		time: "(10 AM - 10:30 AM)"
	},
	{
		event: "Chat with Spencer (Platform team)",
		date: "30 June, 2023", 
		time: "(11 AM - 11:30 AM)"
	},
	{
		event: "Chat with Alex (UI team)",
		date: "30 June, 2023", 
		time: "(1 PM - 1:30 PM)"
	},
]

export default function Teams() {
	return (
		<div className="flex-container">
			<div id="sidebar">
				<img className="opportune-logo-small" src="opportune_logo.png"></img>
				<Link className='logout-button' to="/login"> <ArrowLeftOnRectangleIcon /> </Link>
			</div>
			<div id="content">
				<h2>Welcome Oppenheim </h2>
				<div id="menubar">
					<MainNavigation />
				</div>

				<div className="horiz-flex-container">
				<div className="teams-container">
				{teamInfo.map((team) => {
					return <div className="team-box">
						<div className="team-text">
							<h3>{team.name}</h3>
							<p> {team.description} </p>
							<p> Tools and Technologies:
								<li> {team.tech} </li>
							</p>
						</div>
					</div>
				})}
				</div>
				<div className="meets-container">
				{meetInfo.map((meet) => {
					return <div className="team-box">
						<div className="team-text">
							<h3> {meet.event} </h3>
							<p> {meet.date} </p>
							<p> {meet.time} </p>
						</div>
					</div>
				})}
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