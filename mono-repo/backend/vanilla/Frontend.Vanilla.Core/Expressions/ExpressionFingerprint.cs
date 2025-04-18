// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;

namespace Frontend.Vanilla.Core.Expressions;

// Serves as the base class for all expression fingerprints. Provides a default implementation
// of GetHashCode().
[SuppressMessage("ReSharper", "SX1101", Justification = "Pasted code")]
[SuppressMessage("ReSharper", "SA1512", Justification = "Pasted code")]
internal abstract class ExpressionFingerprint(ExpressionType nodeType, Type type)
{
    // the type of expression node, e.g. OP_ADD, MEMBER_ACCESS, etc.
    public ExpressionType NodeType { get; private set; } = nodeType;

    // the CLR type resulting from this expression, e.g. int, string, etc.
    public Type Type { get; private set; } = type;

    internal virtual void AddToHashCodeCombiner(HashCodeCombiner combiner)
    {
        combiner.AddInt32((int)NodeType);
        combiner.AddObject(Type);
    }

    protected bool Equals(ExpressionFingerprint? other)
    {
        return (other != null)
               && (this.NodeType == other.NodeType)
               && Equals(this.Type, other.Type);
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as ExpressionFingerprint);
    }

    public override int GetHashCode()
    {
        var combiner = new HashCodeCombiner();
        AddToHashCodeCombiner(combiner);

        return combiner.CombinedHash;
    }
}
