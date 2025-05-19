import { supabase } from "./supabase"

const AVATAR_STYLES = ["avataaars", "bottts", "micah", "miniavs", "personas", "pixel-art", "notionists"]

export async function generateAvatar(userId: string): Promise<{ url: string; remaining: number }> {
  try {
    // Get user metadata to check generation count
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) throw userError

    const metadata = userData.user.user_metadata || {}
    const today = new Date().toISOString().split("T")[0]

    // Initialize or get avatar generation tracking
    const avatarGen = metadata.avatar_generation || {}
    const todayGen = avatarGen[today] || 0

    // Check if limit reached
    if (todayGen >= 5) {
      return {
        url: metadata.avatar_url || "",
        remaining: 0,
      }
    }

    // Generate a new avatar
    const style = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)]
    const seed = `${userId}-${Date.now()}`
    const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`

    // Update generation count
    const newGenCount = todayGen + 1
    const newAvatarGen = { ...avatarGen, [today]: newGenCount }

    // Update user metadata
    await supabase.auth.updateUser({
      data: {
        avatar_url: url,
        avatar_generation: newAvatarGen,
      },
    })

    return {
      url,
      remaining: 5 - newGenCount,
    }
  } catch (error) {
    console.error("Error generating avatar:", error)
    throw error
  }
}

export function getAvatarGenerationsRemaining(metadata: any): number {
  const today = new Date().toISOString().split("T")[0]
  const avatarGen = metadata?.avatar_generation || {}
  const todayGen = avatarGen[today] || 0
  return Math.max(0, 5 - todayGen)
}
