import client from "../../client";
import { createWriteStream } from "fs";
import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";
const resolverFn = async (
  _,
  { firstName, lastName, username, email, password, bio, avatar },
  { loggedInUser },
) => {
  const { filename, createReadStream } = await avatar;
  const readStream = createReadStream();
  const writeStream = createWriteStream(process.cwd() + "/uploads/" + filename);
  readStream.pipe(writeStream);
  let uglyPassword = null;
  password && (uglyPassword = await bcrypt.hash(password, 10));
  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      firstName,
      lastName,
      username,
      email,
      bio,
      ...(uglyPassword && { password: uglyPassword }),
    },
  });
  if (updatedUser) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      error: "Could not find user",
    };
  }
};
export default {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};
