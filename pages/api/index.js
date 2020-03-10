import cheerio from "cheerio";
import axios from "axios";

export default async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const activity = {};
  const username = req.query.id || req.query.username;
  if (!username) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        error: "missing github username",
        example:
          "https://github-contributions-json-api.now.sh/api/?username=gaearon"
      })
    );
  }
  const url = `https://github.com/${username}`;
  const github = await axios.get(url, { headers: { Accept: "*/*" } });
  const $ = cheerio.load(github.data);
  $(".day").each((_, element) => {
    const item = $(element);
    const date = item.attr("data-date");
    const count = Number(item.attr("data-count"));
    if (date in activity) {
      activity[date] += count;
    } else {
      activity[date] = count;
    }
  });
  res.statusCode = 200;
  res.end(JSON.stringify(activity));
};
