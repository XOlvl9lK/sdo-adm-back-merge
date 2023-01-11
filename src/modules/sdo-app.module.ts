import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LogsMiddleware } from '@core/middlewares/logs.middleware';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from '@modules/user/user.module';
import { CoreModule } from '@core/core.module';
import { EducationProgramModule } from '@modules/education-program/education-program.module';
import { CourseModule } from '@modules/course/course.module';
import { TestModule } from '@modules/test/test.module';
import { PerformanceModule } from '@modules/performance/performance.module';
import { ForumModule } from '@modules/forum/forum.module';
import { NewsModule } from '@modules/news/news.module';
import { MessengerModule } from '@modules/messenger/messenger.module';
import { EducationRequestModule } from '@modules/education-request/education-request.module';
import { HtmlModule } from '@modules/html/html.module';
import { OtherModule } from '@modules/other/other.module';
import { AuthorityModule } from '@modules/authority/authority.module';
import { GroupModule } from '@modules/group/group.module';
import { FileModule } from '@src/modules/file/file.module';
import { ChapterModule } from '@modules/chapter/chapter.module';
import databaseConfig from '@core/config/database.config';
import { VerificationCentreModule } from '@modules/verification-centre/verification-centre.module';
import { LibraryModule } from '@modules/library/library.module';
import { ProgramSettingsModule } from '@modules/program-settings/program-settings.module';
import { EventModule } from '@modules/event/event.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ControlModule } from '@modules/control/control.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { SessionInterceptor } from '@modules/user/infrastructure/session.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ArchiverModule } from '@modules/archiver/archiver.module';
import { ApplicationSettingsModule } from '@modules/application-settings/application-settings.module';
import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { HttpExceptionFilter } from '@core/exceptions/http-exception.filter';
import { BreadcrumbsModule } from 'src/modules/breadcrumbs/breadcrumbs.module';
import { ExportTaskModule } from '@modules/export-task/export-task.module';

const NODE_ENV = process.env.NODE_ENV || 'DEVELOPMENT';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: NODE_ENV === 'PRODUCTION',
      ...(NODE_ENV === 'DEVELOPMENT' ? { envFilePath: join(__dirname, `../.env`) } : {}),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        ...(databaseConfig as PostgresConnectionOptions),
      }),
    }),
    UserModule,
    CoreModule,
    EducationProgramModule,
    CourseModule,
    TestModule,
    PerformanceModule,
    ForumModule,
    NewsModule,
    MessengerModule,
    EducationRequestModule,
    HtmlModule,
    OtherModule,
    AuthorityModule,
    GroupModule,
    FileModule,
    ChapterModule,
    VerificationCentreModule,
    LibraryModule,
    ProgramSettingsModule,
    EventModule,
    EventEmitterModule.forRoot(),
    ControlModule,
    ScheduleModule.forRoot(),
    ArchiverModule,
    ApplicationSettingsModule,
    BreadcrumbsModule,
    ExportTaskModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SessionInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class SdoAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
