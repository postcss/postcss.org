import React from "react"
import ContributorAvatar from "./../ContributorAvatar"

import styles from "./index.css"

export default class ByTheCommunity extends React.Component {

  state = {
    contributors: [],
  };

  componentDidMount() {
    /* Fetch contributors JSON from GitHub */
    /* eslint-disable max-len */
    /* eslint-disable react/no-did-mount-set-state */
    fetch("https://api.github.com/repos/postcss/postcss/contributors?per_page=200")
      .then(res => res.text())
      .then(body => this.setState({ contributors: JSON.parse(body) }))
  }

  render() {
    const { contributors } = this.state
    return (
      <section className={ styles.root } role="banner">
        <div className={ styles.banner }>

          <h2 className={ styles.title }>{ "Built by community for community" }</h2>
          <p className={ styles.body }>
            { "PostCSS developed and maintained by hundreds of open source contributors. Become part of the family — " }
            <a
              className={ styles.submit }
              href="https://github.com/postcss/postcss/issues"
            >
              { "submit your first Pull\u00A0Request!" }
            </a>
          </p>
        </div>

        <ul className={ styles.contributors }>
          { contributors.map(contributor => (
            <li
              className={ styles.avatar }
              key={ contributor.id }
            >
              <ContributorAvatar { ...contributor } size={ 48 }/>
            </li>
          )) }
        </ul>

      </section>
    )
  }
}
