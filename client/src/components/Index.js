
import React from 'react';
import MovieBanner from '../movie-night.png'

class Index extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			items: [],
			filter: "",
		}

		this.renderItems = this.renderItems.bind(this);
		this.handleTrClick = this.handleTrClick.bind(this);
		this.fetchSerieItems = this.fetchSerieItems.bind(this);
		this.fetchStandardItems = this.fetchStandardItems.bind(this);
		this.redirectBadIndex = this.redirectBadIndex.bind(this);
		this.handleFilterChange = this.handleFilterChange.bind(this);
		this.itemIncludesFilter = this.itemIncludesFilter.bind(this);
	}

	componentDidMount() {
		let path = this.props.path;

		if(path !== "") {
			this.fetchSerieItems(path);
			this.props.updateDocumentTitle(path);
		} else {
			this.fetchStandardItems();
			this.props.updateDocumentTitle();
		}
	}

	redirectBadIndex() {
		this.props.history.push("/index");
	}

	fetchStandardItems() {
		fetch("/items")
			.then(response => response.json())
			.then(data => {
				this.setState({items: data.items})
			})
	}

	fetchSerieItems(serie) {
		fetch("/items/" + serie)
			.then(response => response.json())
			.then(data => {
				this.setState({items: data.items})
			})
			.catch(_ => {
				this.redirectBadIndex();
			})
	}

	itemIncludesFilter(item) {
		return item.name.toUpperCase().includes(this.state.filter);
	}

	renderItems() {
		return this.state.items.map(item => {
			if(this.itemIncludesFilter(item)) {
				return (
					<tr key={item.name} className="indexRow" onClick={() => this.handleTrClick(item)} >
						<td>{item.name}</td>
					</tr>
				)
			}
		});
	}

	numberOfItemsRendered() {
		let count = 0;

		this.state.items.map(item => {
			if(this.itemIncludesFilter(item)) count++;
		});

		return count;
	}

	handleFilterChange(event) {
		this.setState({filter: event.target.value.toUpperCase()});
	}

	handleTrClick(item) {
		if(item.type && item.type === "show") {
			this.props.history.push("/index/" + item.name);
		} else {
			this.props.history.push({
				pathname: "/watch/" + item.url,
				state: {
					url: item.url,
					name: item.name
				}
			});
		}
	}

	render() {
		return (
			<div className="Index">

				<p style={{minHeight: "20px"}} >{this.props.path ? this.props.path : ""}</p>
				<center><img src={MovieBanner} alt="Movie Banner" className="movieBanner" onClick={() => this.props.history.push("/index")} /></center>
				<input type="text" className="inputFilter" placeholder="Filter items: " onChange={this.handleFilterChange} />

				<table className="indexTable">
					<tbody>

						<tr key="index" className="indexRow">
							<td># {this.numberOfItemsRendered()} items indexed</td>
						</tr>

						{this.renderItems()}
					</tbody>
				</table>

			</div>
		);
	}
}

export default Index;
