import { Googlefb } from './../models/customAuth.model';
import { User } from './../models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private UserRepository: Repository<User>) { }

    async getAll() {
        return await this.UserRepository.find();
    }

    async findByEmail(email: string): Promise<User> {
        return await this.UserRepository.findOne({
            where: {
                email,
            },
        });
    }

    async findById(id: string): Promise<User> {
        const res = await this.UserRepository.findOne(id);
        return res;
    }

    async create(user: User): Promise<User> {
        return await this.UserRepository.save(user);
    }

    async customCreate(user: Googlefb): Promise<Googlefb> {
        return await this.UserRepository.save(user);
    }
}
