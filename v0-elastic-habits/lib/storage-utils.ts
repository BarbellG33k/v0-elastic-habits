import { supabase } from "./supabase"
import { v4 as uuidv4 } from "uuid"

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}-${uuidv4()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage.from("user-avatars").upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from("user-avatars").getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error("Error uploading avatar:", error)
    throw error
  }
}
