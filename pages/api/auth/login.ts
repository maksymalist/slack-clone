import { client } from '../../../prisma/client'
import jwt from 'jsonwebtoken'
import bycrypt from 'bcrypt'

const handler = async (req: any, res: any) => {
  try {
    const { email, password } = req.body
    const user = await client.user.findFirst({ where: { email } })
    if (!user) {
      res.status(401).json({
        error: 'User not found',
      })
      return
    }
    if (!bycrypt.compareSync(password, user.password)) {
      res.status(401).json({
        error: 'Password is incorrect',
      })
      return
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: 60 * 60 * 24 * 3, // 3 days
    })
    res.status(200).json({
      token,
    })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}
export default handler
