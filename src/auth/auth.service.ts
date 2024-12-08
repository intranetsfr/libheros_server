import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async subscribe(userData: Partial<User>): Promise<{ accessToken: string }> {
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {

      throw new ConflictException('Cet email est déjà présente dans la base de donnée');
    }
    const userDataInsert: Promise<User> = this.usersService.subscribe(userData);

    const payload = {
      sub: (await userDataInsert).dataValues.id,
      email: (await userDataInsert).dataValues.email,
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Aucun compte trouvé avec cet email / mot de passe.');
    }
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
