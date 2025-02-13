// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;

namespace Frontend.Vanilla.Core.Expressions;

// This is a visitor which produces a fingerprint of an expression. It doesn't
// rewrite the expression in a form which can be compiled and cached.
[SuppressMessage("ReSharper", "SX1101", Justification = "Pasted code")]
[SuppressMessage("ReSharper", "SA1512", Justification = "Pasted code")]
[SuppressMessage("ReSharper", "SA1309", Justification = "Pasted code")]
internal sealed class FingerprintingExpressionVisitor : ExpressionVisitor
{
    private readonly List<object?> seenConstants = new ();
    private readonly List<ParameterExpression> seenParameters = new ();
    private readonly ExpressionFingerprintChain currentChain = new ();
    private bool gaveUp;

    private FingerprintingExpressionVisitor() { }

    private T GiveUp<T>(T node)
    {
        // We don't understand this node, so just quit.

        gaveUp = true;

        return node;
    }

    // Returns the fingerprint chain + captured constants list for this expression, or null
    // if the expression couldn't be fingerprinted.
    public static ExpressionFingerprintChain? GetFingerprintChain(Expression expr, out List<object?>? capturedConstants)
    {
        var visitor = new FingerprintingExpressionVisitor();
        visitor.Visit(expr);

        if (visitor.gaveUp)
        {
            capturedConstants = null;

            return null;
        }

        capturedConstants = visitor.seenConstants;

        return visitor.currentChain;
    }

    public override Expression? Visit(Expression? node)
    {
        if (node == null)
        {
            currentChain.Elements.Add(null);

            return null;
        }

        return base.Visit(node);
    }

    protected override Expression VisitBinary(BinaryExpression node)
    {
        if (gaveUp)
        {
            return node;
        }

        currentChain.Elements.Add(new BinaryExpressionFingerprint(node.NodeType, node.Type, node.Method!));

        return base.VisitBinary(node);
    }

    protected override Expression VisitBlock(BlockExpression node)
    {
        return GiveUp(node);
    }

    protected override CatchBlock VisitCatchBlock(CatchBlock node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitConditional(ConditionalExpression node)
    {
        if (gaveUp)
        {
            return node;
        }

        currentChain.Elements.Add(new ConditionalExpressionFingerprint(node.NodeType, node.Type));

        return base.VisitConditional(node);
    }

    protected override Expression VisitConstant(ConstantExpression node)
    {
        if (gaveUp)
        {
            return node;
        }

        seenConstants.Add(node.Value);
        currentChain.Elements.Add(new ConstantExpressionFingerprint(node.NodeType, node.Type));

        return base.VisitConstant(node);
    }

    protected override Expression VisitDebugInfo(DebugInfoExpression node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitDefault(DefaultExpression node)
    {
        if (gaveUp)
        {
            return node;
        }

        currentChain.Elements.Add(new DefaultExpressionFingerprint(node.NodeType, node.Type));

        return base.VisitDefault(node);
    }

    protected override Expression VisitDynamic(DynamicExpression node)
    {
        return GiveUp(node);
    }

    protected override ElementInit VisitElementInit(ElementInit node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitExtension(Expression node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitGoto(GotoExpression node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitIndex(IndexExpression node)
    {
        if (gaveUp)
        {
            return node;
        }

        currentChain.Elements.Add(new IndexExpressionFingerprint(node.NodeType, node.Type, node.Indexer!));

        return base.VisitIndex(node);
    }

    protected override Expression VisitInvocation(InvocationExpression node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitLabel(LabelExpression node)
    {
        return GiveUp(node);
    }

    protected override LabelTarget VisitLabelTarget(LabelTarget? node)
    {
        return GiveUp(node!);
    }

    protected override Expression VisitLambda<T>(Expression<T> node)
    {
        if (gaveUp)
        {
            return node;
        }

        currentChain.Elements.Add(new LambdaExpressionFingerprint(node.NodeType, node.Type));

        return base.VisitLambda(node);
    }

    protected override Expression VisitListInit(ListInitExpression node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitLoop(LoopExpression node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitMember(MemberExpression node)
    {
        if (gaveUp)
        {
            return node;
        }

        currentChain.Elements.Add(new MemberExpressionFingerprint(node.NodeType, node.Type, node.Member));

        return base.VisitMember(node);
    }

    protected override MemberAssignment VisitMemberAssignment(MemberAssignment node)
    {
        return GiveUp(node);
    }

    protected override MemberBinding VisitMemberBinding(MemberBinding node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitMemberInit(MemberInitExpression node)
    {
        return GiveUp(node);
    }

    protected override MemberListBinding VisitMemberListBinding(MemberListBinding node)
    {
        return GiveUp(node);
    }

    protected override MemberMemberBinding VisitMemberMemberBinding(MemberMemberBinding node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitMethodCall(MethodCallExpression node)
    {
        if (gaveUp)
        {
            return node;
        }

        currentChain.Elements.Add(new MethodCallExpressionFingerprint(node.NodeType, node.Type, node.Method));

        return base.VisitMethodCall(node);
    }

    protected override Expression VisitNew(NewExpression node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitNewArray(NewArrayExpression node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitParameter(ParameterExpression node)
    {
        if (gaveUp)
        {
            return node;
        }

        var parameterIndex = seenParameters.IndexOf(node);

        if (parameterIndex < 0)
        {
            // first time seeing this parameter
            parameterIndex = seenParameters.Count;
            seenParameters.Add(node);
        }

        currentChain.Elements.Add(new ParameterExpressionFingerprint(node.NodeType, node.Type, parameterIndex));

        return base.VisitParameter(node);
    }

    protected override Expression VisitRuntimeVariables(RuntimeVariablesExpression node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitSwitch(SwitchExpression node)
    {
        return GiveUp(node);
    }

    protected override SwitchCase VisitSwitchCase(SwitchCase node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitTry(TryExpression node)
    {
        return GiveUp(node);
    }

    protected override Expression VisitTypeBinary(TypeBinaryExpression node)
    {
        if (gaveUp)
        {
            return node;
        }

        currentChain.Elements.Add(new TypeBinaryExpressionFingerprint(node.NodeType, node.Type, node.TypeOperand));

        return base.VisitTypeBinary(node);
    }

    protected override Expression VisitUnary(UnaryExpression node)
    {
        if (gaveUp)
        {
            return node;
        }

        currentChain.Elements.Add(new UnaryExpressionFingerprint(node.NodeType, node.Type, node.Method!));

        return base.VisitUnary(node);
    }
}
