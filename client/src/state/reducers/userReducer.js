import {
  SET_FRIDGE_DATA,
  SET_SHOPPINGLIST,
  SET_RECIPES,
  SET_BOARD_DATA,
  GET_SUGGESTED_RECIPES,
  ADD_CATEGORY,
  DATA_LOADED,
  DATA_LOADING,
} from "../actions/types";
// const isEmpty = require("is-empty");
const initialState = {
  fridge: [],
  shoppingList: [],
  recipes: [
    {
      URL:
        "https://www.yummly.com/recipe:Cinnamon-Roll-Cookies-2376887,recipe,search_based:search:cookies,list.recipe.search_based:search:cookies",
      name: "Cinnamon Roll Cookies",
      ingredients: [
        {
          name: "unsalted butter",
          quantity: "3/4",
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "granulated sugar",
          quantity: "3/4",
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "large eggs",
          quantity: 1,
          unit: "",
          category: "Dairy",
        },
        {
          name: "vanilla extract",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "all purpose flour",
          quantity: 2.25,
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "baking soda",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "light brown sugar",
          quantity: 6,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "ground cinnamon",
          quantity: 1.5,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: "1/8",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "unsalted butter",
          quantity: 2,
          unit: "tablespoon",
          category: "Dairy",
        },
        {
          name: "powdered sugar",
          quantity: "2/3",
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: 1,
          unit: "pinch",
          category: "Baking & Cooking",
        },
        {
          name: "vanilla extract",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "milk",
          quantity: 3,
          unit: "teaspoon",
          category: "Dairy",
        },
      ],
      image:
        "https://lh3.googleusercontent.com/JSTdyRJv8yP_3WkM0BwHBY3PgNB5UBaWx7FM7DYS-3JvpqkoH1XqrjVeMetO2WYJBIstSXKpmAXTJLm_Sh6_R6o",
    },
    {
      URL:
        "https://www.yummly.com/recipe:Mexican-Wedding-Cookies-9088916,recipe,search_based:search:cookies,list.recipe.search_based:search:cookies",
      name: "Mexican Wedding Cookies",
      ingredients: [
        {
          name: "pecans",
          quantity: "3/4",
          unit: "cup",
          category: "Snack Foods",
        },
        {
          name: "unsalted butter",
          quantity: 1,
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "powdered sugar",
          quantity: "1/2",
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "vanilla extract",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "all purpose flour",
          quantity: 2,
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "powdered sugar",
          quantity: 2,
          unit: "cup",
          category: "Baking & Cooking",
        },
      ],
      image:
        "https://lh3.googleusercontent.com/xtZpiDOI5DT4_bkZZfjKDzBaXGcxD88WrTgurwSyBqEVgu_CFZxzFLbzY30aRY5e63D60LEiCqpIPqWKmlGXDw",
    },
    {
      URL:
        "https://www.yummly.com/recipe:Mexican-Wedding-Cookies-9088916,recipe,search_based:search:cookies,list.recipe.search_based:search:cookies",
      name: "Mexican Wedding Cookies",
      ingredients: [
        {
          name: "pecans",
          quantity: "3/4",
          unit: "cup",
          category: "Snack Foods",
        },
        {
          name: "unsalted butter",
          quantity: 1,
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "powdered sugar",
          quantity: "1/2",
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "vanilla extract",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "all purpose flour",
          quantity: 2,
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "powdered sugar",
          quantity: 2,
          unit: "cup",
          category: "Baking & Cooking",
        },
      ],
      image:
        "https://lh3.googleusercontent.com/xtZpiDOI5DT4_bkZZfjKDzBaXGcxD88WrTgurwSyBqEVgu_CFZxzFLbzY30aRY5e63D60LEiCqpIPqWKmlGXDw",
    },
  ],
  boards: [],
  suggestedRecipes: [
    {
      name: "Easy Korean Sticky Chicken",
      image:
        "https://lh3.googleusercontent.com/GrQx2bXJfqWsY5J9YVQdjixy0Mi675_bCLmV10_jSPJeVLLBgHuBk3or8gb95lsMYTmZMiYT8omiZYdB_64crHtCxVdL8dEpKd1m",
      URL:
        "https://www.yummly.com/private/recipe/Easy-Korean-Sticky-Chicken-9101934?layout=prep-steps",
      ingredients: [
        {
          name: "green onions",
          quantity: 2,
          unit: "",
          category: "Produce",
        },
        {
          name: "boneless, skinless chicken thighs",
          quantity: 1.5,
          unit: "pound",
          category: "Meat",
        },
        {
          name: "salt",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "cornstarch",
          quantity: 4,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "water",
          quantity: 1,
          unit: "teaspoon",
          category: "Drinks",
        },
        {
          name: "fresh ginger",
          quantity: "1/2",
          unit: "inch",
          category: "Produce",
        },
        {
          name: "garlic",
          quantity: 2,
          unit: "clove",
          category: "Produce",
        },
        {
          name: "gochujang",
          quantity: 3,
          unit: "tablespoon",
          category: "Condiments",
        },
        {
          name: "mirin",
          quantity: 2,
          unit: "tablespoon",
          category: "Alcohol",
        },
        {
          name: "honey",
          quantity: 1,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "toasted sesame oil",
          quantity: 1,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "seasoned rice vinegar",
          quantity: 1,
          unit: "tablespoon",
          category: "Condiments",
        },
        {
          name: "vegetable oil",
          quantity: 2,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "toasted sesame seeds",
          quantity: 1,
          unit: "teaspoon",
          category: "Snack Foods",
        },
      ],
    },
    {
      name: "Korean Pork Chops",
      image:
        "https://lh3.googleusercontent.com/6gidAEevFeE6xiMpD7YWKMnFlKwtUQSUZyiWg0d390kpCZ88ttg1Wa1VXbWe5dIz10_jT1392PBFtpanls76",
      URL:
        "https://www.yummly.com/private/recipe/Korean-Pork-Chops-2249749?layout=prep-steps",
      ingredients: [
        {
          name: "New York (top loin) pork chops",
          quantity: 4,
          unit: "",
          category: "Meat",
        },
        {
          name: "soy sauce",
          quantity: "1/2",
          unit: "cup",
          category: "Condiments",
        },
        {
          name: "honey",
          quantity: 4,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "garlic",
          quantity: 12,
          unit: "clove",
          category: "Produce",
        },
        {
          name: "sesame oil",
          quantity: 2,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "fresh ginger root",
          quantity: 4,
          unit: "teaspoon",
          category: "Produce",
        },
        {
          name: "sweet chili sauce",
          quantity: 2,
          unit: "tablespoon",
          category: "Global Foods",
        },
        {
          name: "olive oil",
          quantity: 2,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
      ],
    },
    {
      name: "Melt-In-Your-Mouth Baked Chicken Breasts",
      image:
        "https://lh3.googleusercontent.com/6Kl0pJeahIyMrT32buIMoaUZ_lUrqhVSqlSbh8ZdmWDrI614tFWOfFYKYre3zhmCEUUEFVeY1PlWli3TFa41NYpLZ6EUXUafRyY",
      URL:
        "https://www.yummly.com/private/recipe/Melt-In-Your-Mouth-Baked-Chicken-Breasts-9073095?layout=prep-steps",
      ingredients: [
        {
          name: "nonstick cooking spray",
          quantity: "0",
          unit: "",
          category: "Baking & Cooking",
        },
        {
          name: "boneless skinless chicken breasts",
          quantity: 2,
          unit: "pound",
          category: "Meat",
        },
        {
          name: "salt",
          quantity: 2,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "black pepper",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "garlic powder",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "mayonnaise",
          quantity: "1/4",
          unit: "cup",
          category: "Condiments",
        },
        {
          name: "plain greek yogurt",
          quantity: "1/4",
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "shredded Parmesan cheese",
          quantity: "1/2",
          unit: "cup",
          category: "Dairy",
        },
      ],
    },
    {
      name: "Avocado Chicken Salad",
      image:
        "https://lh3.googleusercontent.com/fJxZlx7sge5IbAVtyY9hcffcnsxTNThSLk-QtZO9udMdWU1dDFMpVxrfypsQecN_OtisPSRm-pYP9O6zNiX2",
      URL: "https://gimmedelicious.com/2018/01/03/avocado-chicken-salad/",
      ingredients: [
        {
          name: "cooked chicken breasts",
          quantity: 2,
          unit: "",
          category: "Deli",
        },
        {
          name: "avocados",
          quantity: 2,
          unit: "",
          category: "Produce",
        },
        {
          name: "corn",
          quantity: "1/2",
          unit: "cup",
          category: "Produce",
        },
        {
          name: "green onion",
          quantity: "1/4",
          unit: "cup",
          category: "Produce",
        },
        {
          name: "cilantro",
          quantity: 2,
          unit: "tablespoon",
          category: "Produce",
        },
        {
          name: "lime",
          quantity: 2,
          unit: "tablespoon",
          category: "Produce",
        },
        {
          name: "olive oil",
          quantity: 2,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: "0",
          unit: "",
          category: "Baking & Cooking",
        },
        {
          name: "pepper",
          quantity: "0",
          unit: "",
          category: "Baking & Cooking",
        },
      ],
    },
    {
      name: "Broccoli Salad",
      image:
        "https://lh3.googleusercontent.com/NJKiNyrgVIz8tgMtLWPMK91TvmPcaVu7HghCmKEeyFBRSnEasdOWhms8v60qG2anH6WJdt1m-EGcl5GR6u6q8Q",
      URL: "https://www.deliciousmeetshealthy.com/broccoli-salad/",
      ingredients: [
        {
          name: "broccoli florets",
          quantity: 8,
          unit: "cup",
          category: "Produce",
        },
        {
          name: "red onion",
          quantity: "1/2",
          unit: "cup",
          category: "Produce",
        },
        {
          name: "bacon",
          quantity: 16,
          unit: "ounce",
          category: "Meat",
        },
        {
          name: "Craisins",
          quantity: "1/2",
          unit: "cup",
          category: "Snack Foods",
        },
        {
          name: "sunflower seeds",
          quantity: "1/2",
          unit: "cup",
          category: "Snack Foods",
        },
        {
          name: "mayo",
          quantity: 1,
          unit: "cup",
          category: "Condiments",
        },
        {
          name: "red wine vinegar",
          quantity: 2,
          unit: "tablespoon",
          category: "Condiments",
        },
        {
          name: "sugar",
          quantity: 3,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: "0",
          unit: "",
          category: "Baking & Cooking",
        },
        {
          name: "freshly ground black pepper",
          quantity: "0",
          unit: "",
          category: "Baking & Cooking",
        },
      ],
    },
    {
      name: "Italian Crescent Casserole",
      image:
        "https://lh3.googleusercontent.com/NTh1b6NZxejNZVhWuJezJKqOQNF1JefgDPdG7AfEjl2DKGiYHNCVVxoYnQg5iTTKwyMsSAR3bTvaN9zz9SfLbg",
      URL:
        "https://www.yummly.com/private/recipe/Italian-Crescent-Casserole-9083675?layout=prep-steps",
      ingredients: [
        {
          name: "ground beef",
          quantity: 1,
          unit: "pound",
          category: "Meat",
        },
        {
          name: "prepared pasta sauce",
          quantity: 1,
          unit: "cup",
          category: "Pasta & Grains",
        },
        {
          name: "refrigerated crescent roll dough",
          quantity: 1,
          unit: "package",
          category: "Baking & Cooking",
        },
        {
          name: "Italian cheese blend",
          quantity: 1,
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "Italian cheese blend",
          quantity: "1/2",
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "dried basil leaves",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
      ],
    },
    {
      name: "Vegan Black Bean Enchiladas",
      image:
        "https://lh3.googleusercontent.com/0q7Opnev2pj9ae27uG1Lg4_W_ekzrKe7cz4_I7ZNBUWlcWtmiCYg0qmGzZ12q_lOql5Gn3RujKEdhGiI5Ya4_OaPhXIOTVNsmw",
      URL:
        "https://www.yummly.com/private/recipe/Vegan-Black-Bean-Enchiladas-9116010?layout=prep-steps",
      ingredients: [
        {
          name: "red enchilada sauce",
          quantity: 2,
          unit: "can",
          category: "Condiments",
        },
        {
          name: "red onion",
          quantity: "1/2",
          unit: "",
          category: "Produce",
        },
        {
          name: "red bell pepper",
          quantity: 1,
          unit: "",
          category: "Produce",
        },
        {
          name: "jalapeno pepper",
          quantity: 1,
          unit: "",
          category: "Produce",
        },
        {
          name: "garlic cloves",
          quantity: 2,
          unit: "",
          category: "Produce",
        },
        {
          name: "extra-virgin olive oil",
          quantity: 1,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "black beans",
          quantity: 1,
          unit: "can",
          category: "Pasta & Grains",
        },
        {
          name: "Hatch mild diced green chiles",
          quantity: 1,
          unit: "can",
          category: "Canned Goods & Soups",
        },
        {
          name: "salt",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "black pepper",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "ground cumin",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "ground coriander",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "dried oregano",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "soft corn tortillas",
          quantity: 12,
          unit: "",
          category: "Bakery",
        },
        {
          name: "fresh cilantro",
          quantity: "0",
          unit: "",
          category: "Produce",
        },
        {
          name: "hot sauce",
          quantity: "0",
          unit: "",
          category: "Condiments",
        },
      ],
    },
    {
      name: "Quick and Easy Italian Meatballs",
      image:
        "https://lh3.googleusercontent.com/z7jNUZH4FkOZNwgB1yloPvacmlhmI5-h1ftZkisNcptFDOGDI9Azm36uZOSgOQr9HGvKedvqHZ7Na7CSX4sLYQ5a9ecY3c0ubOk",
      URL:
        "https://www.yummly.com/private/recipe/Quick-and-Easy-Italian-Meatballs-9073076?layout=prep-steps",
      ingredients: [
        {
          name: "85% lean ground beef",
          quantity: 2,
          unit: "pound",
          category: "Meat",
        },
        {
          name: "garlic",
          quantity: 2,
          unit: "clove",
          category: "Produce",
        },
        {
          name: "large eggs",
          quantity: 2,
          unit: "",
          category: "Dairy",
        },
        {
          name: "dried breadcrumbs",
          quantity: "1/2",
          unit: "cup",
          category: "Packaged Meals & Side Dishes",
        },
        {
          name: "Italian seasoning",
          quantity: 1,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "grated Parmesan cheese",
          quantity: 2,
          unit: "ounce",
          category: "Dairy",
        },
        {
          name: "salt",
          quantity: 1.75,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "black pepper",
          quantity: "0",
          unit: "",
          category: "Baking & Cooking",
        },
        {
          name: "marinara sauce",
          quantity: 1,
          unit: "jar",
          category: "Pasta & Grains",
        },
        {
          name: "grated Parmesan cheese",
          quantity: "0",
          unit: "",
          category: "Dairy",
        },
        {
          name: "fresh basil leaves",
          quantity: "0",
          unit: "",
          category: "Produce",
        },
      ],
    },
    {
      name: "Oven Baked BBQ Baby Back Ribs",
      image:
        "https://lh3.googleusercontent.com/CHLue6ohEEaWm1KU-lqFTw7IUDF_gUkcm1T3vfS7VeoG2Jlz7xKUNdYy2g8OVPF4vaS0aZS1xZgYD47AhCeT",
      URL:
        "https://www.yummly.com/private/recipe/Oven-Baked-BBQ-Baby-Back-Ribs-2436621?layout=prep-steps",
      ingredients: [
        {
          name: "chicken broth",
          quantity: 1.5,
          unit: "cup",
          category: "Canned Goods & Soups",
        },
        {
          name: "baby back ribs",
          quantity: 4,
          unit: "pound",
          category: "Meat",
        },
        {
          name: "salt",
          quantity: "0",
          unit: "",
          category: "Baking & Cooking",
        },
        {
          name: "black pepper",
          quantity: "0",
          unit: "",
          category: "Baking & Cooking",
        },
        {
          name: "dark brown sugar",
          quantity: "6666667/10000000",
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "paprika",
          quantity: 2,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "ground mustard",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "garlic powder",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "onion powder",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "cumin",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "cayenne pepper",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "barbecue sauce",
          quantity: "1/2",
          unit: "cup",
          category: "Condiments",
        },
        {
          name: "fresh rosemary sprigs",
          quantity: "0",
          unit: "",
          category: "Produce",
        },
      ],
    },
    {
      name: "Baked Chicken Parmesan",
      image:
        "https://lh3.googleusercontent.com/oELKKHmQ6Zg6wlvjzZ-lWtNIsuPVIYh2j0T2cYz8Ey75_KJiJxid8_VEDRO0j5z3tAIUk8h4ym9bZU_o1MrkJv7gPObAD0jrLpFc",
      URL:
        "https://www.yummly.com/private/recipe/Baked-Chicken-Parmesan-9083663?layout=prep-steps",
      ingredients: [
        {
          name: "boneless skinless chicken breast cutlets",
          quantity: 1,
          unit: "pound",
          category: "Meat",
        },
        {
          name: "salt",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "black pepper",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "all-purpose flour",
          quantity: "1/3",
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "large egg",
          quantity: 1,
          unit: "",
          category: "Dairy",
        },
        {
          name: "panko breadcrumbs",
          quantity: "1/2",
          unit: "cup",
          category: "Packaged Meals & Side Dishes",
        },
        {
          name: "grated Parmesan cheese",
          quantity: "1/2",
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "salt",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "nonstick cooking spray",
          quantity: "0",
          unit: "",
          category: "Baking & Cooking",
        },
        {
          name: "prepared marinara sauce",
          quantity: "1/2",
          unit: "cup",
          category: "Pasta & Grains",
        },
        {
          name: "shredded mozzarella cheese",
          quantity: "1/2",
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "fresh basil leaves",
          quantity: "0",
          unit: "",
          category: "Produce",
        },
      ],
    },
    {
      name: "Crispy Sesame Tofu and Broccoli",
      image:
        "https://lh3.googleusercontent.com/8PernMZxm2G4jr_G9nU190C0PXWz0mnkO2hvHQxQ4xta4phEp7qpFbYqdIWTmh4ih12Kw7wULdEOLwnccmNlNbtrnsxdvWy6KBU",
      URL:
        "https://www.yummly.com/private/recipe/Crispy-Sesame-Tofu-and-Broccoli-9097949?layout=prep-steps",
      ingredients: [
        {
          name: "extra firm tofu",
          quantity: 1,
          unit: "pound",
          category: "Produce",
        },
        {
          name: "garlic clove",
          quantity: 1,
          unit: "",
          category: "Produce",
        },
        {
          name: "fresh ginger",
          quantity: "1/2",
          unit: "inch",
          category: "Produce",
        },
        {
          name: "water",
          quantity: "1/3",
          unit: "cup",
          category: "Drinks",
        },
        {
          name: "cornstarch",
          quantity: 2,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "tamari",
          quantity: "1/3",
          unit: "cup",
          category: "Condiments",
        },
        {
          name: "light brown sugar",
          quantity: 3,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "rice vinegar",
          quantity: 4,
          unit: "teaspoon",
          category: "Condiments",
        },
        {
          name: "toasted sesame oil",
          quantity: 1,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "crushed red pepper",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "scallions",
          quantity: 2,
          unit: "",
          category: "Produce",
        },
        {
          name: "salt",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "pepper",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "cornstarch",
          quantity: 1,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "neutral oil",
          quantity: 1,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "neutral oil",
          quantity: 1,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "broccoli florets",
          quantity: "3/4",
          unit: "pound",
          category: "Produce",
        },
        {
          name: "water",
          quantity: "1/4",
          unit: "cup",
          category: "Drinks",
        },
        {
          name: "sesame seeds",
          quantity: 2,
          unit: "teaspoon",
          category: "Snack Foods",
        },
      ],
    },
    {
      name: "Indian Butter Chicken",
      image:
        "https://lh3.googleusercontent.com/mJT72be5mzT79bV3BIB1QTRuAkJB1YmRBvKQpsYj9WXxiXlsh6W_SccsEM3gha84NwEJXgEDt5zDwsEvKlXx43E",
      URL:
        "https://www.yummly.com/private/recipe/Indian-Butter-Chicken-9088933?layout=prep-steps",
      ingredients: [
        {
          name: "fresh ginger",
          quantity: 1,
          unit: "inch",
          category: "Produce",
        },
        {
          name: "garlic cloves",
          quantity: 5,
          unit: "",
          category: "Produce",
        },
        {
          name: "lemon",
          quantity: "1/2",
          unit: "",
          category: "Produce",
        },
        {
          name: "plain yogurt",
          quantity: "1/2",
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "ground coriander",
          quantity: 1.5,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "extra virgin olive oil",
          quantity: 1,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "chili powder",
          quantity: 1.5,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "paprika",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "ground turmeric",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "Garam Masala",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "boneless, skinless chicken thighs",
          quantity: 2,
          unit: "pound",
          category: "Meat",
        },
        {
          name: "raw almonds",
          quantity: "1/4",
          unit: "cup",
          category: "Snack Foods",
        },
        {
          name: "raw cashews",
          quantity: "1/4",
          unit: "cup",
          category: "Snack Foods",
        },
        {
          name: "fresh ginger",
          quantity: 1,
          unit: "inch",
          category: "Produce",
        },
        {
          name: "garlic cloves",
          quantity: 5,
          unit: "",
          category: "Produce",
        },
        {
          name: "unsalted butter",
          quantity: "1/4",
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "ground coriander",
          quantity: 2,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "diced tomatoes",
          quantity: 15,
          unit: "ounce",
          category: "Pasta & Grains",
        },
        {
          name: "light brown sugar",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "Garam Masala",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "water",
          quantity: "1/4",
          unit: "cup",
          category: "Drinks",
        },
        {
          name: "vegetable oil",
          quantity: "0",
          unit: "",
          category: "Baking & Cooking",
        },
        {
          name: "water",
          quantity: "3/4",
          unit: "cup",
          category: "Drinks",
        },
        {
          name: "heavy cream",
          quantity: "1/3",
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "fenugreek leaves",
          quantity: 1,
          unit: "tablespoon",
          category: "Produce",
        },
        {
          name: "heavy cream",
          quantity: 2,
          unit: "tablespoon",
          category: "Dairy",
        },
        {
          name: "basmati rice",
          quantity: "0",
          unit: "",
          category: "Pasta & Grains",
        },
        {
          name: "naan bread",
          quantity: "0",
          unit: "",
          category: "Bakery",
        },
      ],
    },
    {
      name: "Cheesecake Cupcakes",
      image:
        "https://lh3.googleusercontent.com/I8sOMFG76nlwTwO71rh18l4mASSrWf_ENJfW7GQoHdlxgHjoJLBEkc6QH3BNRei--HYCe9NMsRxFZkS3RA5Eo1tQQC4AZzDPAw",
      URL:
        "https://www.yummly.com/private/recipe/Cheesecake-Cupcakes-9073059?layout=prep-steps",
      ingredients: [
        {
          name: "graham cracker crumbs",
          quantity: "1/2",
          unit: "cup",
          category: "Snack Foods",
        },
        {
          name: "light brown sugar",
          quantity: 1.5,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "cinnamon",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "salted butter",
          quantity: 2,
          unit: "tablespoon",
          category: "Dairy",
        },
        {
          name: "cream cheese",
          quantity: 1,
          unit: "block",
          category: "Dairy",
        },
        {
          name: "granulated sugar",
          quantity: "1/4",
          unit: "cup",
          category: "Baking & Cooking",
        },
        {
          name: "sour cream",
          quantity: "1/4",
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "vanilla extract",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "large egg",
          quantity: 1,
          unit: "",
          category: "Dairy",
        },
        {
          name: "fresh berries",
          quantity: "0",
          unit: "",
          category: "Produce",
        },
        {
          name: "fresh mint leaves",
          quantity: "0",
          unit: "",
          category: "Produce",
        },
      ],
    },
    {
      name: "Restaurant-Style Loaded Chicken Nachos",
      image:
        "https://lh3.googleusercontent.com/bChSPBn4-zLdMNY2nE-JAabMjfbymqOiZ33_GJW3A8Rga1nzH8DT1iBxNkZlAwyNbnx36I2Hq5wMq4Scw2z8wcHpOgsxHuKUTA",
      URL:
        "https://www.yummly.com/private/recipe/Restaurant-Style-Loaded-Chicken-Nachos-9351334?layout=prep-steps",
      ingredients: [
        {
          name: "ground chicken",
          quantity: 1,
          unit: "pound",
          category: "Meat",
        },
        {
          name: "extra-virgin olive oil",
          quantity: 1,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "chili powder",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "cumin",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "coriander",
          quantity: 1,
          unit: "teaspoon",
          category: "Produce",
        },
        {
          name: "garlic powder",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "dried oregano",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "black pepper",
          quantity: "0",
          unit: "",
          category: "Baking & Cooking",
        },
        {
          name: "black beans",
          quantity: 1,
          unit: "can",
          category: "Pasta & Grains",
        },
        {
          name: "corn tortilla chips",
          quantity: 1,
          unit: "bag",
          category: "Snack Foods",
        },
        {
          name: "shredded Mexican cheese blend",
          quantity: 1,
          unit: "pound",
          category: "Dairy",
        },
        {
          name: "tomatoes",
          quantity: 2,
          unit: "",
          category: "Produce",
        },
        {
          name: "red onion",
          quantity: "1/4",
          unit: "",
          category: "Produce",
        },
        {
          name: "jalapeno chilies",
          quantity: 1,
          unit: "",
          category: "Produce",
        },
        {
          name: "cilantro leaves",
          quantity: "1/4",
          unit: "cup",
          category: "Produce",
        },
        {
          name: "avocado",
          quantity: 1,
          unit: "",
          category: "Produce",
        },
        {
          name: "sliced black olives",
          quantity: 2,
          unit: "tablespoon",
          category: "Condiments",
        },
        {
          name: "lime",
          quantity: "1/2",
          unit: "",
          category: "Produce",
        },
        {
          name: "sour cream",
          quantity: "1/3",
          unit: "cup",
          category: "Dairy",
        },
      ],
    },
    {
      name: "Easy Chicken Enchiladas Verdes",
      image:
        "https://lh3.googleusercontent.com/NU6PCMCjSeK1TZO88kB_GWhdjGXDlNosEGCLEEvIhJ3QOoqq0V5-yOvsiqMBwI-3JH9x0SG_VS-DNv8-Enjl",
      URL:
        "https://www.yummly.com/private/recipe/Easy-Chicken-Enchiladas-Verdes-9083652?layout=prep-steps",
      ingredients: [
        {
          name: "salsa verde",
          quantity: 2,
          unit: "jar",
          category: "Global Foods",
        },
        {
          name: "rotisserie chicken",
          quantity: 12,
          unit: "ounce",
          category: "Meat",
        },
        {
          name: "sour cream",
          quantity: "1/3",
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "ground cumin",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "ground coriander",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "garlic powder",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "shredded Mexican style cheese",
          quantity: 1,
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "soft corn tortillas",
          quantity: 12,
          unit: "",
          category: "Bakery",
        },
        {
          name: "shredded Mexican style cheese",
          quantity: 1,
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "cilantro",
          quantity: "0",
          unit: "",
          category: "Produce",
        },
      ],
    },
    {
      name: "Black Bean Salad",
      image:
        "https://lh3.googleusercontent.com/Jnb5f2bko17OdQI5XvX1iVHlvvktaWmUEHU8JLH-MSImc2mhN4ecq72gviUIfI4Ky8TYTC2i9LMZ7AycecfFjEU",
      URL: "https://www.twopeasandtheirpod.com/black-bean-salad/",
      ingredients: [
        {
          name: "black beans",
          quantity: 15,
          unit: "ounce",
          category: "Pasta & Grains",
        },
        {
          name: "corn",
          quantity: 1,
          unit: "cup",
          category: "Produce",
        },
        {
          name: "cherry tomatoes",
          quantity: 1,
          unit: "cup",
          category: "Produce",
        },
        {
          name: "red bell pepper",
          quantity: 1,
          unit: "cup",
          category: "Produce",
        },
        {
          name: "red onion",
          quantity: "1/2",
          unit: "cup",
          category: "Produce",
        },
        {
          name: "chopped cilantro",
          quantity: "1/2",
          unit: "cup",
          category: "Produce",
        },
        {
          name: "limes",
          quantity: 1.5,
          unit: "",
          category: "Produce",
        },
        {
          name: "olive oil",
          quantity: 1,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "kosher salt",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "chili powder",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "ground cumin",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "avocado",
          quantity: 1,
          unit: "",
          category: "Produce",
        },
      ],
    },
    {
      name: "Jalapeno Popper Dip",
      image:
        "https://lh3.googleusercontent.com/mZjI2SbtVbOXW-vA7ylJbyvYDKc8Dkq4igVsDtccGoxLJAJJjmmst4_0TH2Fm3yDEaXuNKGm66ugwJ8NHx-uOg",
      URL: "https://www.noshtastic.com/jalapeno-popper-dip/",
      ingredients: [
        {
          name: "cooked bacon",
          quantity: 8,
          unit: "slice",
          category: "Meat",
        },
        {
          name: "cream cheese",
          quantity: 1,
          unit: "pound",
          category: "Dairy",
        },
        {
          name: "mayonnaise",
          quantity: "1/2",
          unit: "cup",
          category: "Condiments",
        },
        {
          name: "sour cream",
          quantity: "1/2",
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "sharp cheddar cheese",
          quantity: "3/4",
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "Parmesan cheese",
          quantity: "1/2",
          unit: "cup",
          category: "Dairy",
        },
        {
          name: "jalapeno peppers",
          quantity: 3,
          unit: "",
          category: "Produce",
        },
        {
          name: "garlic powder",
          quantity: 1,
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "sliced green onions",
          quantity: 3,
          unit: "",
          category: "Produce",
        },
      ],
    },
    {
      name: "Baked Greek Chicken with Fresh Lemon and Dill",
      image:
        "https://lh3.googleusercontent.com/MnmAydw3p1evuez1bbW_-ZD6JIF7WtFHERDbL8UNG_-rNKHr8x4odd4BVTLusYCNda1-hqOcgGUpK8CV-e1DFQ",
      URL:
        "https://www.yummly.com/private/recipe/Baked-Greek-Chicken-with-Fresh-Lemon-and-Dill-9088936?layout=prep-steps",
      ingredients: [
        {
          name: "garlic cloves",
          quantity: 4,
          unit: "",
          category: "Produce",
        },
        {
          name: "fresh dill",
          quantity: 5,
          unit: "tablespoon",
          category: "Produce",
        },
        {
          name: "lemons",
          quantity: 2,
          unit: "",
          category: "Produce",
        },
        {
          name: "skin-on, bone-in chicken thighs",
          quantity: 8,
          unit: "",
          category: "Meat",
        },
        {
          name: "salt",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "freshly ground black pepper",
          quantity: "1/2",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
        {
          name: "extra virgin olive oil",
          quantity: 1,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "extra virgin olive oil",
          quantity: 3,
          unit: "tablespoon",
          category: "Baking & Cooking",
        },
        {
          name: "salt",
          quantity: "1/4",
          unit: "teaspoon",
          category: "Baking & Cooking",
        },
      ],
    },
  ],
  categories: [],
  loading: true,
};
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_FRIDGE_DATA:
      return {
        ...state,
        fridge: action.payload,
      };
    case SET_SHOPPINGLIST:
      return {
        ...state,
        shoppingList: action.payload,
      };
    case SET_RECIPES:
      return {
        ...state,
        recipes: action.payload,
      };
    case SET_BOARD_DATA:
      return {
        ...state,
        boards: action.payload,
      };
    case GET_SUGGESTED_RECIPES:
      return {
        ...state,
        suggestedRecipes: action.payload,
      };
    case DATA_LOADING:
      return {
        ...state,
        loading: true,
      };
    case DATA_LOADED:
      return {
        ...state,
        loading: false,
      };
    case ADD_CATEGORY:
      return {
        ...state,
        categories: action.payload,
      };
    default:
      return state;
  }
}
