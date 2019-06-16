# gatsby-plugin-linkedin-resume

## Requirement

You need to download your linkedin information here https://www.linkedin.com/psettings/member-data 

todo add a screenshot

rename the zio file linkedin.zip and put it in the root of your project.

## Installation

```sh
npm i gatsby-plugin-linkedin-resume

yarn add gatsby-plugin-linkedin-resume
```

gatsby-config.js
```js
module.exports = {
  siteMetadata: {
    ...
  },
  plugins: [
    'gatsby-plugin-linkedin-resume',
    ...
  ],
};
```

## Usage
You can now query your linkedin data in graphql queries

```graphql
query MyQuery {
  linkedInResume {
    headline
    education {
      schoolName
      startDate
    }
    languages {
      name
    }
    experiences {
      companyName
      title
      description
      location
      startedOn
      finishedOn
    }
  }
}
```
