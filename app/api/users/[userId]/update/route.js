import { connectToDB } from "@mongodb";
import User from "@models/User";
export async function POST(request, { params }) {
  try {
    await connectToDB();
    const { userId } = params;
    const body = await request.json();
    const { username, profileImage } = body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        profileImage,
      },
      {
        new: true,
      }
    );
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to update user", { status: 500 });
  }
}
