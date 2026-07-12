const bcrypt = require("bcryptjs");

(async () => {
  const hash = "$2b$10$kRzC4KNxB5Z7hYvN6xT0N.1O5X3e6X8Q6L4Y7T9W2Z1X8V4N6M";

  console.log(await bcrypt.compare("admin123", hash));
})();