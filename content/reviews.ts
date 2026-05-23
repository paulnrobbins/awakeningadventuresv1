/**
 * Real testimonials from the current site. Copy is verbatim — these are
 * actual guests, and the snapshot's "no AI faces / AI voiceover" rule
 * extends to never fabricating customer quotes.
 */

export type Review = {
  author: string;
  title: string;
  body: string;
  rating: 5;
};

export const REVIEWS: Review[] = [
  {
    author: 'Felicia',
    title: 'Serenity',
    body: 'We really enjoyed ourselves. We loved the serenity of being out in the woods with nature. The tent is stocked with anything you might need to have a comfortable stay. Anthony and Barb were very kind and welcoming. Barb’s cookies are great. The location is wonderful and quiet. The sky was beautiful at night. Would definitely stay again!',
    rating: 5,
  },
  {
    author: 'Sabrina',
    title: 'It’s just you and nature',
    body: 'Anthony and Barb were so inviting, we arrived an hour early because we forgot about the time zones and they were ready for us anyways. They greeted us at the car and brought a cart to help get our things to the tent. They were friendly and helpful with anything we needed throughout the stay. The trails are nice to walk along and the overlook just up the road is beautiful. There is so much land and it is a great escape from a busy city or regular neighborhood. It is just you and nature. They had everything we could have needed in the tent and more. The stove was our favorite part as it made the tent nice and warm and smell like wood. The showers are so beautifully made and we want to go back just to get to experience them. Overall, amazing people, place, and experience for anyone. Thank you both so much.',
    rating: 5,
  },
  {
    author: 'Spencer',
    title: 'Great for a large group',
    body: 'Anthony was an amazing host. Provided us fire wood, a pop up privacy tent, and bags for water. The property is great for camping for a large group. There is also a dog named Chief who is such a sweetheart and made our stay even better. Would definitely recommend to anyone wanting a nice night to camp and hang out.',
    rating: 5,
  },
];
