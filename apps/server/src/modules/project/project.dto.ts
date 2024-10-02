import { IsNotEmpty, IsString, IsInt } from 'class-validator';

class ProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project title must not be empty.' })
  title: string;
}

export class CreateProjectDto extends ProjectDto {}
export class EditProjectDto extends ProjectDto {}
