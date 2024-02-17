import { Profile } from "../entities/profile";
import { IuuidGenerator } from "../interfaces/adapters/uuidGenerator";
import { IProfileRepository } from "../interfaces/repositories/profileRepository";
import { BadRequestError, NotFoundError } from "../util/errors";
import { ErrorHandlerUseCases } from "../util/errors/errorHandler";
import { IFindAllProfilesData, IFindProfileByIdData, IFindProfileByUserId, IProfile, IProfileCreateData } from "../util/models/profileModels";
import { IFindUserByIdData } from "../util/models/userModels";

export const ERROR_MESSAGE_NOT_FOUND_PROFILE_BY_ID = 'Profile not found by id';
export const ERROR_MESSAGE_NOT_FOUND_PROFILE_BY_USER_ID = 'This user does not have a registered profile';
export const ERROR_MESSAGE_PROFILE_FIND_ALL_PARAMS =
  'Error when searching for users. Please ensure that: (page > 0), (size > 0), and (size <= 10).';

export interface IProfileUseCases {
  create(data: IProfileCreateData): Promise<IProfile>;
  update(data: IProfile): Promise<IProfile>;
  findAll(data: IFindAllProfilesData): Promise<IProfile[]>;
  findById(data: IFindProfileByIdData): Promise<IProfile | null>;
  findProfileByUserId(data: IFindProfileByUserId): Promise<IProfile | null>;
}

export class ProfileUseCases extends ErrorHandlerUseCases implements IProfileUseCases {

  constructor(
    private profileRepository: IProfileRepository,
    private uuidGenerator: IuuidGenerator) {
    super();
  }

  public async create(data: IProfileCreateData): Promise<IProfile> {
    try {
      const id = await this.uuidGenerator.generate();
      const profile = new Profile({ ...data, id });
      await this.profileRepository.create(profile);
      return profile.data;
    } catch (error) {
      this.handleError(error);
    }
  }
  public async update(data: IProfile): Promise<IProfile> {
    try {
      const currentProfile = await this.findById({ id: data.id });
      data.userId = currentProfile.userId;
      const profileToUpdate = new Profile(data);
      await this.profileRepository.update(profileToUpdate.data);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findAll(data: IFindAllProfilesData): Promise<IProfile[]> {
    try {
      if (data.page < 1 || data.size < 1 || data.size > 10) {
        throw new BadRequestError(ERROR_MESSAGE_PROFILE_FIND_ALL_PARAMS);
      }
      return this.profileRepository.findAll(data);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findById(data: IFindUserByIdData): Promise<IProfile> {
    try {
      const result = await this.profileRepository.findById(data);
      if (!result) {
        throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND_PROFILE_BY_ID);
      }
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async findProfileByUserId(data: IFindProfileByUserId): Promise<IProfile | null> {
    try {
      const result = await this.profileRepository.findProfileByUserId(data);
      if (!result) {
        throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND_PROFILE_BY_USER_ID);
      }
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

}