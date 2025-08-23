// Utility funkce pro práci s články a hráči
import { playerData } from './playerData';
import { articles } from './articleData';

// Vytvoří mapu jmen hráčů pro rychlé vyhledávání
const createPlayerNameMap = () => {
  const nameMap = new Map();
  
  playerData.forEach(player => {
    // Přidáme celé jméno
    nameMap.set(player.name.toLowerCase(), player);
    
    // Přidáme jen příjmení
    const lastName = player.name.split(' ').pop();
    nameMap.set(lastName.toLowerCase(), player);
    
    // Speciální případy a zkrácené verze
    const specialCases = {
      'Tomáš Tureček': ['Tury', 'Turym', 'Tureček'],
      'Jiří Šalanda': ['Šali', 'Šalim', 'Šalanda'],
      'Luboš Coufal': ['Coufi', 'Coufim', 'Coufal'],
      'Oliver Štěpanovský': ['Olča', 'Ondra', 'Štěpanovský'],
      'Dan Kačeňák': ['Dan', 'Dana', 'Kačeňák'],
      'Lukáš Zmeškal': ['Zmeškalem', 'Zmeškal'],
      'Jan Hanuš': ['Honza', 'Honzovi', 'Honzy', 'Hanuš'],
      'Jakub Seidler': ['Kuba', 'Kuby', 'Seidler'],
      'Michal Koreš': ['Koreš'],
      'Pavel Schubada St.': ['Pavel Schubada St'],
      'Pavel Schubada ml.': ['Pavel Schubada ml'],
      'Jan Schubada': ['Jan Schubada'],
      'Adam Schubada': ['Adam Schubada'],
      'Jiří Matuška': ['bratři Matuškovi', 'bratrem', 'Matuška'],
      'Lukáš Matuška': ['bratři Matuškovi', 'bratrem', 'Matuška'],
      'Josef "Pepa"': ['Pepa', 'Josef']
    };
    
    Object.entries(specialCases).forEach(([fullName, aliases]) => {
      if (player.name === fullName) {
        aliases.forEach(alias => {
          nameMap.set(alias.toLowerCase(), player);
        });
      }
    });
  });
  
  return nameMap;
};

// Funkce pro nalezení hráčů zmíněných v článku
export const findPlayersInArticle = (articleContent) => {
  const mentionedPlayers = new Set();
  const nameMap = createPlayerNameMap();
  
  // Odstraníme HTML tagy pro lepší hledání
  const plainText = articleContent.replace(/<[^>]*>/g, ' ').toLowerCase();
  
  // Projdeme všechny možné jména a hledáme je v textu
  nameMap.forEach((player, name) => {
    if (plainText.includes(name)) {
      mentionedPlayers.add(player);
    }
  });
  
  return Array.from(mentionedPlayers);
};

// Funkce pro získání článků, které zmiňují daného hráče
export const getArticlesForPlayer = (playerId) => {
  const player = playerData.find(p => p.id === playerId);
  if (!player) return [];
  
  const relatedArticles = [];
  
  articles.forEach(article => {
    const mentionedPlayers = findPlayersInArticle(article.content);
    if (mentionedPlayers.some(p => p.id === playerId)) {
      relatedArticles.push(article);
    }
  });
  
  return relatedArticles;
};

// Funkce pro nahrazení jmen hráčů odkazy v HTML obsahu článku
export const createPlayerLinks = (htmlContent) => {
  const nameMap = createPlayerNameMap();
  let processedContent = htmlContent;
  
  // Seznam frází, které chceme nahradit jako celek
  const replacements = [];
  
  // Speciální fráze pro více hráčů
  const multiPlayerPhrases = [
    {
      pattern: /bratři Matuškovi|Jiří a Lukáš Matuškovi/gi,
      replacement: () => {
        const jiri = playerData.find(p => p.id === 'matuska-jiri');
        const lukas = playerData.find(p => p.id === 'matuska-lukas');
        return `<a href="/profil/matuska-jiri" class="text-amber-400 hover:text-amber-300 underline">${jiri?.name || 'Jiří Matuška'}</a> a <a href="/profil/matuska-lukas" class="text-amber-400 hover:text-amber-300 underline">${lukas?.name || 'Lukáš Matuška'}</a>`;
      }
    },
    {
      pattern: /Dan(?:em)?\s+Kačeňák(?:em)?|Dana?\s+Kačeňák(?:a|ovi)?/gi,
      replacement: (match) => {
        return `<a href="/profil/kacenak-dan" class="text-amber-400 hover:text-amber-300 underline">${match}</a>`;
      }
    },
    {
      pattern: /Lukáš(?:em)?\s+Zmeškal(?:em)?/gi,
      replacement: (match) => {
        return `<a href="/profil/zmeskal-lukas" class="text-amber-400 hover:text-amber-300 underline">${match}</a>`;
      }
    }
  ];
  
  // Nahradit speciální fráze
  multiPlayerPhrases.forEach(({ pattern, replacement }) => {
    processedContent = processedContent.replace(pattern, replacement);
  });
  
  // Přidat jednotlivé hráče do seznamu nahrazení
  nameMap.forEach((player, searchName) => {
    // Vytvoříme různé varianty jména pro hledání
    const variations = [
      player.name,
      player.name.split(' ').pop(), // příjmení
    ];
    
    // Přidáme speciální případy
    if (player.name === 'Tomáš Tureček') {
      variations.push('Tury', 'Turym', 'Turyho');
    }
    if (player.name === 'Jiří Šalanda') {
      variations.push('Šali', 'Šalim', 'Šaliho');
    }
    if (player.name === 'Luboš Coufal') {
      variations.push('Coufi', 'Coufim', 'Coufiho');
    }
    if (player.name === 'Oliver Štěpanovský') {
      variations.push('Olča', 'Ondra', 'Ondrou');
    }
    if (player.name === 'Jan Hanuš') {
      variations.push('Honza', 'Honzovi', 'Honzy');
    }
    if (player.name === 'Jakub Seidler') {
      variations.push('Kuba', 'Kuby', 'Kubu');
    }
    if (player.name === 'Michal Koreš') {
      variations.push('Koreš');
    }
    if (player.name === 'Josef "Pepa"') {
      variations.push('Pepa', 'Pepy');
    }
    
    variations.forEach(variant => {
      if (variant && !processedContent.includes(`href="/profil/${player.id}"`)) {
        replacements.push({
          text: variant,
          player: player,
          length: variant.length
        });
      }
    });
  });
  
  // Seřadit nahrazení podle délky (delší první)
  replacements.sort((a, b) => b.length - a.length);
  
  // Provést nahrazení
  replacements.forEach(({ text, player }) => {
    // Vytvoříme regex, který najde text, ale ne pokud už je v odkazu
    const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(?<!<a[^>]*>)(?<!href=")\\b${escapedText}\\b(?![^<]*</a>)`,
      'gi'
    );
    
    processedContent = processedContent.replace(regex, (match) => {
      // Zachováme původní velikost písmen
      return `<a href="/profil/${player.id}" class="text-amber-400 hover:text-amber-300 underline">${match}</a>`;
    });
  });
  
  return processedContent;
};

// Export pro kompatibilitu
export default {
  findPlayersInArticle,
  getArticlesForPlayer,
  createPlayerLinks
};