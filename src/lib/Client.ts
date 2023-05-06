import { container, LogLevel, SapphireClient } from '@sapphire/framework'
import { env } from './environment'
import { getRootData } from '@sapphire/pieces'
import { IntentsBitField } from 'discord.js'
import { join } from 'path'
import { Locale } from 'discord-api-types/v9'
import { PrismaClient } from '@prisma/client'
import { readdirSync } from 'fs'

export class UserClient extends SapphireClient {
	public constructor() {
		super( {
			defaultPrefix: env.DISCORD_PREFIX ?? '!',
			i18n: {
				fetchLanguage: context => {
					const { languages } = container.i18n
					const lang = context.guild?.preferredLocale ?? ''
					return languages.has( lang ) ? lang : Locale.EnglishUS
				}
			},
			intents: new IntentsBitField( [ 'Guilds', 'GuildMessages' ] ),
			loadDefaultErrorListeners: true,
			logger: {
				level: LogLevel.Info
			}
		} )
		container.prisma = new PrismaClient()

		const modulesPath = join( getRootData().root, 'modules' )
		const modules = readdirSync( modulesPath )
		for ( const module of modules ) {
			this.stores.registerPath( join( modulesPath, module ) )
		}
	}

	public async start(): Promise<void> {
		await this.login( env.DISCORD_TOKEN )
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		prisma: PrismaClient
	}
}
