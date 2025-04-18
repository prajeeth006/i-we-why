// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

using System.Collections.Generic;

namespace Frontend.Vanilla.Core.Expressions;

internal delegate TValue Hoisted<TModel, TValue>(TModel model, List<object>? capturedConstants);
