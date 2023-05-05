import { container, LogLevel, SapphireClient } from '@sapphire/framework'
import { env } from './environment'
import { Intents } from 'discord.js'
import { Locale } from 'discord-api-types/v9'
import type { Sequelize } from 'sequelize'

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
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES
			],
			loadDefaultErrorListeners: true,
			logger: {
				level: LogLevel.Info
			}
		} )
	}

	public async start(): Promise<void> {
		await this.login( env.DISCORD_TOKEN )
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		sequelize: Sequelize
	}
}
