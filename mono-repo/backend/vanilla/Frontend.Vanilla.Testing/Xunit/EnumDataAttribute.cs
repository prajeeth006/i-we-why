using System;

namespace Frontend.Vanilla.Testing.Xunit;

internal sealed class EnumDataAttribute(Type enumType) : ValuesDataAttribute(Enum.GetValues(enumType)) { }
