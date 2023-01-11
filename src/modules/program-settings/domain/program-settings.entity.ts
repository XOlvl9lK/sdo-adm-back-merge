import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '@core/domain/base.entity';
import { RoleDibEntity } from '@modules/authority/domain/role-dib.entity';
import { EducationElementEntity } from '@modules/education-program/domain/education-element.entity';

@Entity('program_settings')
export class ProgramSettingsEntity extends BaseEntity {
  @ManyToOne(() => RoleDibEntity)
  @JoinColumn()
  role: RoleDibEntity;

  @Column({ nullable: true, comment: 'ID ДИБ роли' })
  roleId: string;

  @ManyToMany(() => EducationElementEntity, {
    cascade: true,
  })
  @JoinTable()
  obligatory: EducationElementEntity[];

  @ManyToMany(() => EducationElementEntity, {
    cascade: true,
  })
  @JoinTable()
  optional: EducationElementEntity[];

  constructor(role: RoleDibEntity) {
    super();
    this.role = role;
  }

  setObligatory(educationElements: EducationElementEntity[]) {
    this.obligatory = educationElements;
  }

  setOptional(educationElements: EducationElementEntity[]) {
    this.optional = educationElements;
  }
}
