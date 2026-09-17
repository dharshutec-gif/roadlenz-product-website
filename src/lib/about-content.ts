import type { AboutData } from './about-types';

// Initial editorial content. Existing CMS records are never overwritten.
export function getAboutDefaults(): AboutData {
  return {
  "aboutSections": [
    {
      "id": "hero",
      "order": 1,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "slug": "hero",
      "eyebrow": "ABOUT ROADLENZ",
      "title": "People. Purpose. Progress.",
      "description": "RoadLenz is a Bigfox Engineering brand built for clearer, safer fleet operations.",
      "note": "A safer tomorrow moves with you.",
      "image": "",
      "ctaLabel": "Discover our story",
      "ctaHref": "#our-story"
    },
    {
      "id": "vision",
      "order": 2,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "slug": "vision",
      "eyebrow": "OUR VISION",
      "title": "A safer, more connected world on the move.",
      "description": "We envision a world where every vehicle, every driver and every journey is empowered by intelligent technology — making roads safer, businesses stronger and communities better connected.",
      "note": "Safer people. Stronger businesses.\nBrighter tomorrows.",
      "image": "/media/about/journey.webp",
      "ctaLabel": "",
      "ctaHref": ""
    },
    {
      "id": "mission",
      "order": 3,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "slug": "mission",
      "eyebrow": "OUR MISSION",
      "title": "Engineering trust for a safer tomorrow.",
      "description": "We build reliable, easy-to-use fleet solutions that help businesses operate more safely, efficiently and sustainably — through innovation, real-world expertise and a people-first approach.",
      "note": "Technology with purpose.\nProgress for people.",
      "image": "",
      "ctaLabel": "",
      "ctaHref": ""
    },
    {
      "id": "journey",
      "order": 4,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "slug": "journey",
      "eyebrow": "OUR JOURNEY",
      "title": "Driven by a bigger purpose.",
      "description": "",
      "note": "Same roads. A brighter tomorrow.",
      "image": "/media/about/journey.webp",
      "ctaLabel": "",
      "ctaHref": ""
    },
    {
      "id": "locations",
      "order": 5,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "slug": "locations",
      "eyebrow": "OUR WORLDWIDE LOCATIONS",
      "title": "Connected across the world.",
      "description": "Local presence. A global perspective. We work closely with customers and partners to make roads safer, wherever they are.",
      "note": "",
      "image": "",
      "ctaLabel": "",
      "ctaHref": ""
    },
    {
      "id": "support",
      "order": 6,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "slug": "support",
      "eyebrow": "SUPPORT",
      "title": "Here when you need us.",
      "description": "Real people. Real solutions. Our dedicated teams are ready to support your fleet, wherever you are.",
      "note": "Keeping you on the move.",
      "image": "/media/about/journey.webp",
      "ctaLabel": "",
      "ctaHref": ""
    },
    {
      "id": "leadership",
      "order": 7,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "slug": "leadership",
      "eyebrow": "LEADERSHIP",
      "title": "Guided by purpose. Driven by people.",
      "description": "Our leadership brings together deep industry experience and a shared commitment to safer, smarter and more sustainable mobility.",
      "note": "",
      "image": "",
      "ctaLabel": "",
      "ctaHref": ""
    },
    {
      "id": "contact",
      "order": 8,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "slug": "contact",
      "eyebrow": "",
      "title": "Let’s talk.",
      "description": "Ready to make your fleet safer and more efficient?\nSend us an enquiry and our team will get back to you.",
      "note": "Safer fleets. Brighter tomorrows.",
      "image": "/media/about/journey.webp",
      "ctaLabel": "Send an Enquiry",
      "ctaHref": "/contact"
    }
  ],
  "aboutSlides": [
    {
      "id": "about-slide-1",
      "order": 1,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "title": "Fleet operations",
      "alt": "Fleet engineer overlooking trucks at a blue-hour depot",
      "media": {
        "type": "image",
        "src": "/media/about/fleet.webp"
      }
    },
    {
      "id": "about-slide-2",
      "order": 2,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "title": "Installation & deployment",
      "alt": "Installation team fitting equipment inside a commercial vehicle",
      "media": {
        "type": "image",
        "src": "/media/about/installation.webp"
      }
    },
    {
      "id": "about-slide-3",
      "order": 3,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "title": "Customer call support",
      "alt": "Customer support team in a fleet operations room",
      "media": {
        "type": "image",
        "src": "/media/about/support.webp"
      }
    }
  ],
  "aboutMilestones": [
    {
      "id": "about-milestone-1",
      "order": 1,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "year": "2016",
      "title": "",
      "description": "",
      "image": ""
    },
    {
      "id": "about-milestone-2",
      "order": 2,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "year": "2019",
      "title": "",
      "description": "",
      "image": ""
    },
    {
      "id": "about-milestone-3",
      "order": 3,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "year": "2022",
      "title": "",
      "description": "",
      "image": ""
    },
    {
      "id": "about-milestone-4",
      "order": 4,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "year": "Today",
      "title": "",
      "description": "",
      "image": ""
    }
  ],
  "aboutOffices": [
    {
      "id": "chennai-headquarters",
      "order": 1,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "title": "Bigfox Office",
      "officeType": "Headquarters",
      "city": "Chennai",
      "region": "Tamil Nadu",
      "country": "India",
      "address": [
        "Plot No. 23, Women Industrial Park",
        "SIDCO Industrial Estate",
        "Thirumudivakkam",
        "Chennai, Chengalpattu",
        "Tamil Nadu – 600044",
        "India"
      ],
      "phone": "+91 98416 00444",
      "email": "sales@bigfox.co.in",
      "headquarters": true,
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Plot%20No.%2023%20Women%20Industrial%20Park%20SIDCO%20Industrial%20Estate%20Thirumudivakkam%20Chennai%20600044",
      "image": "",
      "lat": 12.968,
      "lng": 80.102
    },
    {
      "id": "chennai-production-unit",
      "order": 2,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "title": "Production Facility",
      "officeType": "Production Unit",
      "city": "Old Perungalathur",
      "region": "Tamil Nadu",
      "country": "India",
      "address": [
        "Plot No. 46, AGS Office Staff Colony",
        "Kishkintha Road",
        "Old Perungalathur",
        "Chennai, Chengalpattu District",
        "Tamil Nadu – 600063",
        "India"
      ],
      "phone": "+91 98416 00444",
      "email": "sales@bigfox.co.in",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Plot%20No.%2046%20AGS%20Office%20Staff%20Colony%20Kishkintha%20Road%20Old%20Perungalathur%20Chennai%20600063",
      "headquarters": false,
      "image": "",
      "lat": 12.908,
      "lng": 80.088
    },
    {
      "id": "bangalore",
      "order": 3,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "title": "Bangalore Branch",
      "officeType": "Branch Office",
      "city": "Bangalore",
      "region": "Karnataka",
      "country": "India",
      "address": [
        "BigFox Engineering Pvt Ltd",
        "No. 29, First Main, Second Cross",
        "Bachappa Layout",
        "Bangalore – 16",
        "India"
      ],
      "phone": "+91 98416 00444",
      "email": "sales@bigfox.co.in",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=BigFox+Engineering+Pvt+Ltd%2C+No.+29%2C+First+Main%2C+Second+Cross%2C+Bachappa+Layout%2C+Bangalore%2C+India",
      "headquarters": false,
      "image": "",
      "lat": 12.972,
      "lng": 77.595
    },
    {
      "id": "germany-office",
      "order": 4,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "title": "Germany Office",
      "officeType": "European Office",
      "city": "Erlangen",
      "region": "Bavaria",
      "country": "Germany",
      "address": [
        "Fraunhoferstraße 27",
        "91058 Erlangen",
        "Germany"
      ],
      "email": "sales@bigfox.co.in",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Fraunhoferstra%C3%9Fe%2027%2091058%20Erlangen%20Germany",
      "headquarters": false,
      "image": "",
      "lat": 49.59,
      "lng": 11.004
    },
    {
      "id": "netherlands-office",
      "order": 5,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "title": "Netherlands Office",
      "officeType": "European Office",
      "city": "Veldhoven",
      "region": "North Brabant",
      "country": "The Netherlands",
      "address": [
        "Vlierbeek 39",
        "5501 AJ",
        "Veldhoven",
        "North Brabant",
        "The Netherlands"
      ],
      "email": "sales@bigfox.co.in",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Vlierbeek%2039%205501%20AJ%20Veldhoven%20Netherlands",
      "headquarters": false,
      "image": "",
      "lat": 51.418,
      "lng": 5.407
    },
    {
      "id": "usa-office",
      "order": 6,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "title": "USA Office",
      "officeType": "North America Office",
      "city": "Mountain House",
      "region": "California",
      "country": "United States",
      "address": [
        "266 W Moraga St",
        "Mountain House",
        "California 95391",
        "United States"
      ],
      "email": "sales@bigfox.co.in",
      "mapsUrl": "https://www.google.com/maps/search/?api=1&query=266%20W%20Moraga%20St%20Mountain%20House%20CA%2095391%20United%20States",
      "headquarters": false,
      "image": "",
      "lat": 37.78,
      "lng": -121.54
    }
  ],
  "aboutSupport": [
    {
      "id": "about-support-1",
      "order": 1,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "title": "Customer Call Support",
      "description": "Our customer support team is here to assist you with enquiries, product information and general support.",
      "phone": "+91 98416 00444",
      "email": "sales@bigfox.co.in",
      "image": "/media/about/support.webp"
    },
    {
      "id": "about-support-2",
      "order": 2,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "title": "Technical Support",
      "description": "Get help with your RoadLenz setup, troubleshooting and day-to-day fleet operations.",
      "phone": "+91 98416 00444",
      "email": "sales@bigfox.co.in",
      "image": "/media/about/fleet.webp"
    },
    {
      "id": "about-support-3",
      "order": 3,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "title": "Installation Support",
      "description": "Connect with our installation team for deployment, vehicle setup and on-site assistance.",
      "phone": "+91 98416 00444",
      "email": "sales@bigfox.co.in",
      "image": "/media/about/installation.webp"
    }
  ],
  "aboutLeaders": [
    {
      "id": "about-leader-1",
      "order": 1,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "name": "",
      "role": "Managing Director",
      "quote": "",
      "image": ""
    },
    {
      "id": "about-leader-2",
      "order": 2,
      "published": true,
      "createdAt": "2026-09-08T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z",
      "name": "",
      "role": "Chief Executive Officer",
      "quote": "",
      "image": ""
    }
  ]
};
}
