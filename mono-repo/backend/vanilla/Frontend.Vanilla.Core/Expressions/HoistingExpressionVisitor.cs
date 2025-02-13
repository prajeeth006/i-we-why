// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;

namespace Frontend.Vanilla.Core.Expressions;

// This is a visitor which rewrites constant expressions as parameter lookups. It's meant
// to produce an expression which can be cached safely.
[SuppressMessage("ReSharper", "SX1101", Justification = "Pasted code")]
[SuppressMessage("ReSharper", "SA1512", Justification = "Pasted code")]
[SuppressMessage("ReSharper", "SA1309", Justification = "Pasted code")]
internal sealed class HoistingExpressionVisitor<TIn, TOut> : ExpressionVisitor
{
    private static readonly ParameterExpression HoistedConstantsParamExpr = Expression.Parameter(typeof(List<object>), "hoistedConstants");
    private int numConstantsProcessed;

    // factory will create instance
    private HoistingExpressionVisitor() { }

    public static Expression<Hoisted<TIn, TOut>> Hoist(Expression<Func<TIn, TOut>> expr)
    {
        // rewrite Expression<Func<TIn, TOut>> as Expression<Hoisted<TIn, TOut>>

        var visitor = new HoistingExpressionVisitor<TIn, TOut>();
        var rewrittenBodyExpr = visitor.Visit(expr.Body);
        var rewrittenLambdaExpr = Expression.Lambda<Hoisted<TIn, TOut>>(rewrittenBodyExpr, expr.Parameters[0], HoistedConstantsParamExpr);

        return rewrittenLambdaExpr;
    }

    protected override Expression VisitConstant(ConstantExpression node)
    {
        // rewrite the constant expression as (TConst)hoistedConstants[i];
        return Expression.Convert(Expression.Property(HoistedConstantsParamExpr, "Item", Expression.Constant(numConstantsProcessed++)), node.Type);
    }
}
