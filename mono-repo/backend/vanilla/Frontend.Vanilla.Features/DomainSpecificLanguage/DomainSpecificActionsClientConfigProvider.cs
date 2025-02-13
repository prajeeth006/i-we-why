using System;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.DomainSpecificActions.Configuration;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.DomainSpecificLanguage;

internal sealed class DomainSpecificLanguageClientConfigProvider(IDslConfiguration config)
    : LambdaClientConfigProvider("vnDomainSpecificLanguage",  () => new { config.DefaultValuesUnregisteredProvider }) { }
