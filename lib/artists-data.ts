export interface Artist {
  id: string;
  name: string;
  slug: string;
  origin: string;
  city: string;
  country: string;
  genre: string[];
  category: 'music' | 'photo' | 'visual' | 'dance' | 'tattoo';
  bio: string;
  photo_url?: string;
  spotify_id?: string;
  spotify_listeners?: string;
  instagram?: string;
  facebook?: string;
  youtube_channel?: string;
  youtube_channel2?: string;
  youtube_featured_video?: string;
  booking_email?: string;
  website?: string;
  label?: string;
  releases?: {
    id: string;
    title: string;
    year: number;
    type: 'album' | 'ep' | 'mixtape' | 'single';
    spotify_id?: string;
    soundcloud_url?: string;
    cover_url?: string;
  }[];
  timeline?: {
    year: number;
    event: string;
  }[];
  stats?: {
    spotify?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
}

export const ARTISTS: Artist[] = [
  {
    id: 'monstaaa-lovni',
    name: "Monstaaa L'Ovni",
    slug: 'monstaaa-lovni',
    origin: 'Martinique / Guyane',
    city: 'Toulouse',
    country: 'France',
    genre: ['Hip-Hop', 'Reggae', 'Trap', 'Dancehall'],
    category: 'music',
    label: 'Bande 2 Loups Records',
    bio: "Artiste multidimensionnel aux identités plurielles — Monstaaa, L'Ovni, Monstaaa L'Ovni — chacune portant une couleur musicale distincte. Né en Martinique, grandi en Guyane, c'est à Lyon qu'il forge son identité artistique dès 2002 au sein du groupe Sekel Block, avant de co-fonder le label Bande 2 Loups Records avec KDA Films en 2015. Installé à Toulouse depuis 2024, il continue de tisser une discographie riche traversant le reggae, le dancehall et le trap avec un flow authentique et des textes ciselés.",
    spotify_id: '038Iz0gPJqbFC9UYQitqMC',
    instagram: 'steph_apan',
    facebook: 'share/1DSPNEnxs2/?mibextid=wwXIfr',
    youtube_channel: '@monstaaalovni8706',
    youtube_channel2: '@monstaa-ai',
    booking_email: 'bande2loups@gmail.com',
    releases: [
      { id: 'juste-une-minute', title: 'Juste Une Minute', year: 2026, type: 'single', spotify_id: '61h7pq9pswhEeyDide34Yr' },
      { id: 'le-son-du-four', title: 'Le Son du Four', year: 2025, type: 'single', spotify_id: '6ffJucnPumZo2QucBCV2Ax' },
      { id: 'mada', title: 'Mada', year: 2025, type: 'single', spotify_id: '1ttwPAOzEm8UpJeU5Ii9lr' },
      { id: 'bipolar', title: 'BIPOLAR Mixtape', year: 2023, type: 'mixtape', soundcloud_url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A2019230685' },
      { id: 'back-from-radikal', title: 'Back From Radikal', year: 2022, type: 'ep', spotify_id: '4voxI7k3Piy6LK6wi0t3ik' },
      { id: 'back2radikal', title: 'Back 2 Radikal', year: 2021, type: 'album', soundcloud_url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1350644977' },
      { id: 'coeur-en-panne', title: 'Cœur En Panne', year: 2020, type: 'album' },
      { id: 'yeah', title: 'Yeah', year: 2018, type: 'album' },
      { id: 'before-yeah', title: 'Before Yeah Mixtape', year: 2017, type: 'mixtape' },
      { id: 'trap-list-tape', title: 'Trap-List-Tape', year: 2013, type: 'mixtape', soundcloud_url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A2018334345' },
    ],
    timeline: [
      { year: 2002, event: 'Arrivée à Lyon — début de la scène musicale' },
      { year: 2011, event: 'Sekel Block — Fête de la Musique Lyon, Place des Célestins' },
      { year: 2011, event: 'Tournée Madagascar avec Sekel Block (invité par Gasy\'Ploit) — TV, radio, presse' },
      { year: 2012, event: 'Exit Festival — Novi Sad, Serbie (150 000 visiteurs)' },
      { year: 2012, event: 'Retour Madagascar — 2ème tournée' },
      { year: 2013, event: 'Trap-List-Tape (Gasy\'Ploit / Sekel Block)' },
      { year: 2015, event: 'Co-fondation de Bande 2 Loups Records avec KDA Films' },
      { year: 2017, event: 'Before Yeah Mixtape — lancement solo' },
      { year: 2018, event: 'Yeah (album) + Les Loups D\'Or compilations' },
      { year: 2020, event: 'Cœur En Panne + collabs B2L (COMPTON, Raffales)' },
      { year: 2023, event: 'BIPOLAR Mixtape — label 5152758 Records DK' },
      { year: 2024, event: 'Installation à Toulouse' },
      { year: 2025, event: 'Le Son du Four + Mada' },
      { year: 2026, event: 'Juste Une Minute — dernier single' },
    ],
    stats: { spotify: '346K auditeurs/mois' },
  },
  {
    id: 'toxic',
    name: "TOXIC'",
    slug: 'toxic',
    origin: 'Madagascar',
    city: 'Lyon',
    country: 'France',
    genre: ['Rap', 'Trap', 'Afrobeat'],
    category: 'music',
    label: 'Bande 2 Loups Records',
    bio: "Rappeur au flow engagé et aux références philosophiques profondes — Griffith de Berserk, Morpheus de Matrix. Né à Madagascar, TOXIC' s'impose dans la scène underground lyonnaise au sein de Bande 2 Loups Records. Co-fondateur de GI.Corp, structure de production musicale et audiovisuelle, il combine rap conscient, trap et touches afrobeat dans des textes ciselés.",
    timeline: [
      { year: 2015, event: 'Intégration Bande 2 Loups Records' },
      { year: 2017, event: 'Freestyle B2L feat. Bidox & Williams, prod Maeskro' },
      { year: 2020, event: 'AbAbA feat. B2L Records — Black Gold Riddim #01' },
      { year: 2021, event: 'Code Morse feat. Ice J — By GICORP' },
    ],
  },
  {
    id: 'madness-trap-boss',
    name: 'Madness Trap Boss',
    slug: 'madness-trap-boss',
    origin: 'Guyane 🇬🇫',
    city: 'Guyane',
    country: 'France',
    genre: ['Trap', 'Dancehall'],
    category: 'music',
    bio: "Trap Boss venu de Guyane, MADNESS impose un style percutant sur la scène des musiques urbaines. Fort d'une communauté engagée sur les réseaux, il est propulsé par son booker @gdl_goutdeluxe et continue de construire une discographie qui marque son territoire.",
    spotify_id: '7IMhImhA7MZlGHf7HnYiX0',
    instagram: 'madness_trapboss_officiel',
    facebook: 'share/1QSQMUdFAM/?mibextid=wwXIfr',
    youtube_channel: '@madnesstrapboss2976',
    youtube_channel2: '@madness9738',
    stats: { spotify: '271 auditeurs/mois', instagram: '6.6K abonnés' },
    timeline: [
      { year: 2020, event: 'Premiers sons — scène trap guyanaise' },
      { year: 2023, event: 'Montée en puissance sur les réseaux' },
    ],
  },
  {
    id: 'sekta',
    name: 'SEKTA',
    slug: 'sekta',
    origin: 'Lyon',
    city: 'Lyon',
    country: 'France',
    genre: ['Reggae', 'Dancehall', 'Rap'],
    category: 'music',
    label: 'Killa Sound Massive',
    bio: "Membre fondateur du groupe ETHOS et pilier du Killa Sound Massive (créé en 1999), SEKTA incarne la scène reggae-dancehall lyonnaise depuis plus de 15 ans. À la croisée du reggae roots, du dancehall et du rap urbain, son show man reconnu lui a valu des premières parties de Buju Banton, Admiral T, Junior Kelly, Turbulence, Sniper et Lino.",
    instagram: 'sekta_officiel',
    timeline: [
      { year: 1999, event: 'Killa Sound Massive — Lyon' },
      { year: 2011, event: 'Scène Fête de la Musique Lyon aux côtés de Sekel Block' },
      { year: 2013, event: 'Premières parties — Buju Banton, Admiral T, Junior Kelly' },
      { year: 2015, event: 'Sorties solo — Partout c\'est la même, Sexuelle Addiction' },
    ],
  },
  {
    id: 'x-man',
    name: 'X-Man',
    slug: 'x-man',
    origin: 'Fort-de-France, Martinique 🇲🇶',
    city: 'Martinique',
    country: 'France',
    genre: ['Dancehall', 'Reggae', 'Trap'],
    category: 'music',
    label: 'Tônôp Music',
    bio: "Né le 9 novembre 1984 à Fort-de-France, X-Man est l'artiste incontournable du dancehall martiniquais. Grandi dans les sound systems et fêtes patronales de la Martinique, il fusionne le dancehall caribéen et les réalités sociales créoles. Prix Spécial SACEM 2013. Son album Saturday Night (2014) a atteint le Top 149 France.",
    spotify_id: '4VYr2jD1AzhmEyT2L8xTg4',
    instagram: 'xman972',
    booking_email: 'xmanagement972@gmail.com',
    releases: [
      { id: 'saturday-night', title: 'Saturday Night', year: 2014, type: 'album' },
      { id: 'x-retrospective', title: 'X-Retrospective Vol.1', year: 2013, type: 'album' },
      { id: 'atypique', title: 'Atypique', year: 2011, type: 'album' },
      { id: 'di-baddest', title: 'Di Baddest Mixtape', year: 2016, type: 'mixtape' },
    ],
    timeline: [
      { year: 2011, event: 'Atypique — premier album, hits Soirée arrosée, Madinina Kuduro' },
      { year: 2013, event: 'Prix Spécial SACEM' },
      { year: 2014, event: 'Saturday Night — Top 149 France' },
      { year: 2015, event: 'Fondation de Tônôp Music' },
      { year: 2023, event: 'Coco, Shatta Shark' },
    ],
    stats: { spotify: '324.9K auditeurs/mois', instagram: '154K abonnés', facebook: '177K likes' },
  },
  {
    id: 'yaniss-odua',
    name: 'Yaniss Odua',
    slug: 'yaniss-odua',
    origin: 'Martinique 🇲🇶',
    city: 'France',
    country: 'France',
    genre: ['Reggae', 'Dancehall', 'Futu\'Roots'],
    category: 'music',
    label: 'Baco Records',
    bio: "Né en 1978 en Martinique, Yaniss Odua est l'une des figures majeures du reggae français. Plus de 120 millions de vues YouTube cumulées, une discographie riche traversant le reggae roots, le dancehall et le Futu'Roots. Son single La Caraïbe l'a propulsé sur la scène internationale.",
    spotify_id: '4DIUpxntUKirdKs79Cpjrl',
    instagram: 'yanissodua',
    releases: [
      { id: 'stay-high', title: 'Stay High', year: 2022, type: 'album' },
      { id: 'nouvelle-donne', title: 'Nouvelle Donne', year: 2017, type: 'album' },
      { id: 'moment-ideal', title: 'Moment Idéal', year: 2013, type: 'album' },
      { id: 'yon-pa-yon', title: 'Yon Pa Yon', year: 2002, type: 'album' },
    ],
    timeline: [
      { year: 2002, event: 'Yon Pa Yon — débuts' },
      { year: 2013, event: 'Moment Idéal — consécration internationale' },
      { year: 2017, event: 'Nouvelle Donne' },
      { year: 2022, event: 'Stay High' },
      { year: 2025, event: 'Mon Frère feat. FNX' },
    ],
    stats: { spotify: '346K auditeurs/mois', instagram: '51K abonnés' },
  },
  {
    id: 'sizzla',
    name: 'Sizzla',
    slug: 'sizzla',
    origin: 'Annotto Bay, Jamaïque 🇯🇲',
    city: 'Kingston',
    country: 'Jamaica',
    genre: ['Reggae', 'Roots', 'Dancehall'],
    category: 'music',
    label: 'Xterminator Productions',
    bio: "Né le 17 avril 1976 à Annotto Bay, élevé à August Town Kingston, Sizzla est une légende vivante du reggae roots et du dancehall. Membre de l'ordre Bobo Ashanti, sa discographie compte plus de 60 albums. Black Woman & Child (1997) reste un classique absolu du genre.",
    spotify_id: '5RXsUXZSsGMVqWfvSnqbj6',
    releases: [
      { id: 'black-woman-child', title: 'Black Woman & Child', year: 1997, type: 'album' },
      { id: 'praise-ye-jah', title: 'Praise Ye Jah', year: 1997, type: 'album' },
      { id: 'burning-up', title: 'Burning Up', year: 1995, type: 'album' },
    ],
    timeline: [
      { year: 1995, event: 'Burning Up — débuts' },
      { year: 1997, event: 'Black Woman & Child — classique absolu du reggae' },
      { year: 2000, event: '+60 albums — discographie monumentale' },
    ],
    stats: { spotify: '1.3M auditeurs/mois' },
  },
  {
    id: 'busta-rhymes',
    name: 'Busta Rhymes',
    slug: 'busta-rhymes',
    origin: 'Brooklyn, New York 🇺🇸',
    city: 'New York',
    country: 'USA',
    genre: ['Hip-Hop', 'East Coast', 'Rap'],
    category: 'music',
    label: 'Conglomerate Records',
    bio: "Né le 20 mai 1972 à Brooklyn, Trevor Tahiem Smith Jr. alias Busta Rhymes est une icône du hip-hop East Coast. Flow ultra-rapide, énergie scénique légendaire, hits planétaires. De The Coming (1996) à Extinction Level Event (1998), il a redéfini les standards du rap.",
    spotify_id: '1YfEcTuGvBQ8xSD1f53UnK',
    releases: [
      { id: 'extinction', title: 'Extinction Level Event', year: 1998, type: 'album' },
      { id: 'when-disaster', title: 'When Disaster Strikes', year: 1997, type: 'album' },
      { id: 'the-coming', title: 'The Coming', year: 1996, type: 'album' },
    ],
    timeline: [
      { year: 1996, event: 'The Coming — premier album solo' },
      { year: 1997, event: 'When Disaster Strikes' },
      { year: 1998, event: 'Extinction Level Event' },
      { year: 2020, event: 'Aftermath — retour fracassant' },
    ],
    stats: { spotify: '12.7M auditeurs/mois' },
  },
  {
    id: 'snoop-dogg',
    name: 'Snoop Dogg',
    slug: 'snoop-dogg',
    origin: 'Long Beach, Californie 🇺🇸',
    city: 'Los Angeles',
    country: 'USA',
    genre: ['Hip-Hop', 'West Coast', 'G-Funk'],
    category: 'music',
    label: 'Doggystyle Records',
    bio: "Né le 20 octobre 1971 à Long Beach, Calvin Cordozar Broadus Jr. alias Snoop Dogg est une légende du hip-hop mondial. Doggystyle (1993) reste l'un des albums les plus vendus de l'histoire du rap. Ambassadeur de la culture hip-hop depuis 30 ans.",
    spotify_id: '7hJcb9fa4alzcOq3EaNPoG',
    releases: [
      { id: 'doggystyle', title: 'Doggystyle', year: 1993, type: 'album' },
      { id: 'tha-doggfather', title: 'Tha Doggfather', year: 1996, type: 'album' },
      { id: 'rg', title: 'R&G (Rhythm & Gangsta)', year: 2004, type: 'album' },
    ],
    timeline: [
      { year: 1993, event: 'Doggystyle — 10M d\'albums vendus' },
      { year: 1996, event: 'Tha Doggfather' },
      { year: 2004, event: 'R&G — Rhythm & Gangsta' },
      { year: 2024, event: 'Flambeaux des JO Paris 2024' },
    ],
    stats: { spotify: '32.9M auditeurs/mois' },
  },
  {
    id: 'young-thug',
    name: 'Young Thug',
    slug: 'young-thug',
    origin: 'Atlanta, Georgia 🇺🇸',
    city: 'Atlanta',
    country: 'USA',
    genre: ['Trap', 'Melodic Rap', 'ATL'],
    category: 'music',
    label: 'YSL Records',
    bio: "Né le 16 août 1991 à Atlanta, Jeffery Lamar Williams alias Young Thug a révolutionné le trap avec son flow mélodique unique. Co-fondateur de YSL Records, il a façonné le son d'une génération.",
    spotify_id: '50co4Is1HCEo8bhOyUWKpn',
    releases: [
      { id: 'punk', title: 'PUNK', year: 2021, type: 'album' },
      { id: 'so-much-fun', title: 'So Much Fun', year: 2019, type: 'album' },
    ],
    timeline: [
      { year: 2014, event: 'Barter 6 — percée internationale' },
      { year: 2019, event: 'So Much Fun — premier album certifié' },
      { year: 2021, event: 'PUNK — collaboration Gunna' },
    ],
    stats: { spotify: '29.5M auditeurs/mois' },
  },
  {
    id: 'booba',
    name: 'Booba',
    slug: 'booba',
    origin: 'Boulogne-Billancourt 🇫🇷',
    city: 'Paris',
    country: 'France',
    genre: ['Rap', 'Trap', 'Rap Hardcore'],
    category: 'music',
    label: 'DUC Records / Tallac Records',
    bio: "Né le 9 décembre 1976 à Boulogne-Billancourt, d'origine sénégalaise, Élie Yaffa alias Booba est l'une des figures les plus influentes du rap français. Discographie monumentale depuis Temps Mort (2002), il a façonné le rap francophone pendant deux décennies.",
    spotify_id: '3YvCp8mzwGbvbABkCmijgQ',
    instagram: 'booba',
    releases: [
      { id: 'ultra', title: 'ULTRA', year: 2020, type: 'album' },
      { id: 'au-dela', title: 'Au-delà', year: 2012, type: 'album' },
      { id: 'ouest-side', title: 'Ouest Side', year: 2006, type: 'album' },
      { id: 'temps-mort', title: 'Temps Mort', year: 2002, type: 'album' },
    ],
    timeline: [
      { year: 2002, event: 'Temps Mort — album fondateur' },
      { year: 2006, event: 'Ouest Side — consécration' },
      { year: 2020, event: 'ULTRA' },
    ],
    stats: { spotify: '5M auditeurs/mois' },
  },
];

export function getArtistBySlug(slug: string): Artist | undefined {
  return ARTISTS.find((a) => a.slug === slug);
}

export function getArtistsByGenre(genre: string): Artist[] {
  return ARTISTS.filter((a) =>
    a.genre.some((g) => g.toLowerCase().includes(genre.toLowerCase()))
  );
}

export function getArtistsByCategory(category: string): Artist[] {
  return ARTISTS.filter((a) => a.category === category);
}
