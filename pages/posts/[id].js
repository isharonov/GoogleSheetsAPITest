import { google } from "googleapis";

export async function getServerSideProps({ query }) {
  // Auth
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Query
  const { id } = query;
  const range = `Фрукты и овощи!A${id}:E${id}`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  // Result
  const [name, price, unit, description, photoLink] = response.data.values[0];

  const photoId =
    /(https:\/\/drive\.google\.com\/file\/d\/)([a-zA-Z0-9-_]+)/gm.exec(
      photoLink
    )[2];

  return {
    props: {
      name,
      price,
      unit,
      description,
      photoId,
    },
  };
}

export default function Post({ name, price, unit, description, photoId }) {
  return (
    <article>
      <h1>{name}</h1>
      <p>
        <strong>
          {price} руб / {unit}
        </strong>
      </p>
      <p>{description}</p>
      <p>
        <img src={"https://drive.google.com/uc?id=" + photoId} alt={name} />
      </p>
    </article>
  );
}
